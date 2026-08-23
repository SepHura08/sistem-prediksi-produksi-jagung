<?php

namespace App\Services;

use App\Models\weather_logs;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class WeatherService
{
    private float  $latitude  = 1.0404;
    private float  $longitude = 97.765;
    private string $urlAPI    = 'https://api.open-meteo.com/v1/forecast';

    public function ambilCuacaTerkini(): array
    {
        try {
            $respons = Http::timeout(10)->get($this->urlAPI, [
                'latitude'      => $this->latitude,
                'longitude'     => $this->longitude,
                'daily'         => implode(',', [
                    'temperature_2m_mean',
                    'relative_humidity_2m_mean',
                    'precipitation_sum',
                ]),
                'timezone'      => 'Asia/Jakarta',
                'forecast_days' => 16,
            ]);

            if (!$respons->successful()) {
                Log::warning('Open-Meteo gagal: ' . $respons->status());
                return $this->fallbackCuaca();
            }

            $json       = $respons->json();
            $tanggal   = $json['daily']['time']                 ?? [];
            $suhu      = $json['daily']['temperature_2m_mean']          ?? [];
            $kelembapan= $json['daily']['relative_humidity_2m_mean']   ?? [];
            $hujan     = $json['daily']['precipitation_sum']           ?? [];

            $prakiraan = [];
            foreach ($tanggal as $i => $tgl) {
                $suhuHari     = $suhu[$i]       !== null ? (float) $suhu[$i]       : null;
                $lembapHari   = $kelembapan[$i] !== null ? (float) $kelembapan[$i] : null;
                $hujanHari    = $hujan[$i]       !== null ? (float) $hujan[$i]       : 0.0;

                if ($suhuHari === null) continue;

                $prakiraan[] = [
                    'tanggal'      => $tgl,
                    'hari'         => Carbon::parse($tgl)->locale('id')->isoFormat('ddd'),
                    'tanggal_indo' => Carbon::parse($tgl)->locale('id')->isoFormat('D MMM'),
                    'suhu'         => round($suhuHari, 1),
                    'curah_hujan'  => round($hujanHari, 1),
                    'kelembapan'   => $lembapHari ? round($lembapHari, 0) : null,
                    'ikon'         => $this->curahHujanKeIkon($hujanHari),
                    'kondisi'      => $this->curahHujanKeKondisi($hujanHari),
                    'aman_semprot' => $hujanHari < 5, // Standar dasar per hari
                    // 'aman_pupuk' dihilangkan dari sini karena butuh evaluasi Look-Ahead di fungsi buatRekomendasi
                ];
            }

            if (empty($prakiraan)) {
                return $this->fallbackCuaca();
            }

            $hariIni = $prakiraan[0];
            weather_logs::updateOrCreate(
                ['date' => $hariIni['tanggal']],
                [
                    'temperature' => $hariIni['suhu'],
                    'rainfall'    => $hariIni['curah_hujan'],
                    'humidity'    => $hariIni['kelembapan'] ?? 80.0,
                ]
            );
//return data ke controller
            return [
                'berhasil'    => true,
                'sumber'      => 'api',
                'hari_ini'    => $hariIni,
                'prakiraan'   => $prakiraan,
                'rekomendasi' => $this->buatRekomendasi($prakiraan),
            ];

        } catch (\Exception $e) {
            Log::error('WeatherService error: ' . $e->getMessage());
            return $this->fallbackCuaca();
        }
    }

    // LOGIKA REKOMENDASI OPERASIONAL PETANI (FARMING ADVISORY ENGINE)
    // ─────────────────────────────────────────────────────────────────────────
    // Aturan disusun berdasarkan ambang curah hujan praktis untuk budidaya 
    // jagung di wilayah dengan curah hujan tinggi (Karakteristik Lokal). 
    // Berfungsi sebagai panduan operasional harian untuk memitigasi risiko 
    // gagal aplikasi (pupuk hanyut/pestisida luntur), bukan sebagai keputusan 
    // agronomis mutlak.

    public function buatRekomendasi(array $prakiraan): array
{
    $jumlahHari = count($prakiraan);

    // Batasan paling logis: Minimal harus ada 2 hari data (Hari ini dan Besok)
    if ($jumlahHari < 2) {
        return $this->defaultRekomendasiKosong();
    }
    // Batasi maksimal data yang dianalisis untuk siklus mingguan (maksimal 8 hari untuk look-ahead 7 hari)
    $limitData = min($jumlahHari, 8);
    $delapanHari = array_slice($prakiraan, 0, $limitData);

    // Hitung total hujan 7 hari (atau gunakan data hari yang tersedia jika < 7)
    $hariIrigasi = min(count($delapanHari), 7);
    $totalHujan7 = array_sum(
        array_column(
            array_slice($delapanHari, 0, $hariIrigasi),
            'curah_hujan'
        )
    );

    $hariMap = [
        'Senin' => 'Sen', 'Selasa' => 'Sel', 'Rabu' => 'Rab',
        'Kamis' => 'Kam', 'Jumat' => 'Jum', 'Sabtu' => 'Sab', 'Minggu' => 'Min'
    ];

    $listHariAmanPupuk = [];
    $listHariAmanSemprot = [];

    // Batasi loop agar berhenti tepat sebelum indeks terakhir yang tersedia
    $loopLimit = count($delapanHari) - 1; 

    for ($i = 0; $i < $loopLimit; $i++) {
        $hariIni = $delapanHari[$i];
        $hariBesok = $delapanHari[$i + 1];

        $hujanHariIni = $hariIni['curah_hujan'];
        $hujanBesok   = $hariBesok['curah_hujan'];

 
        // Pemupukan
        if ($hujanHariIni < 10 && $hujanBesok < 15) {
            $listHariAmanPupuk[] = $hariMap[$hariIni['hari']] ?? $hariIni['hari'];
        }

        // Penyemprotan
        if ($hujanHariIni < 10 && $hujanBesok < 10) {
            $listHariAmanSemprot[] = $hariMap[$hariIni['hari']] ?? $hariIni['hari'];
        }
    }

    $hariPupukString = implode(', ', $listHariAmanPupuk);
    $hariSemprotString = implode(', ', $listHariAmanSemprot);

    return [
        'pemupukan' => [
            'status' => count($listHariAmanPupuk) >= 1 ? 'disarankan' : 'tunda',
            'warna'  => count($listHariAmanPupuk) >= 1 ? 'hijau' : 'kuning',
            'ikon'   => '🌱',
            'judul'  => count($listHariAmanPupuk) >= 1 ? "Pemupukan — {$hariPupukString}" : "Pemupukan — Tunda",
            'pesan'  => count($listHariAmanPupuk) >= 1 
                ? "Cuaca mendukung di hari ({$hariPupukString}). Kondisi tanah ideal untuk penyerapan pupuk."
                : "Tunda pemupukan. Risiko pencucian pupuk tinggi akibat indikasi hujan lebat.",
        ],
        'penyemprotan' => [
            'status' => count($listHariAmanSemprot) >= 1 ? 'disarankan' : 'tunda',
            'warna'  => count($listHariAmanSemprot) >= 1 ? 'hijau' : 'merah',
            'ikon'   => '🧴',
            'judul'  => count($listHariAmanSemprot) >= 1 ? "Penyemprotan — {$hariSemprotString}" : "Tunda Penyemprotan",
            'pesan'  => count($listHariAmanSemprot) >= 1 
                ? "Hari ideal: ({$hariSemprotString}). Disarankan menambahkan perekat pestisida jika cuaca mendung."
                : "Tunda penyemprotan. Curah hujan >10mm berisiko tinggi melunturkan pestisida.",
        ],
        'irigasi' => [
            'status' => $totalHujan7 >= 50 ? 'tidak_perlu' : 'perlu',
            'warna'  => $totalHujan7 >= 50 ? 'biru' : 'kuning',
            'ikon'   => '💧',
            'judul'  => $totalHujan7 >= 50 ? 'Irigasi — Tidak Diperlukan' : 'Irigasi — Perlu Diperhatikan',
            'pesan'  => $totalHujan7 >= 50 
                ? "Total hujan 7 hari = {$totalHujan7}mm. Kebutuhan pasokan air fase kritis tanaman terpenuhi."
                : "Total hujan 7 hari hanya {$totalHujan7}mm. Lakukan irigasi tambahan untuk menjaga kelembapan tanah.",
        ],
    ];
}

    private function defaultRekomendasiKosong(): array
    {
        return [
            'pemupukan' => ['status' => 'tunda', 'warna' => 'kuning', 'ikon' => '🌱', 'judul' => 'Pemupukan — Data Kosong', 'pesan' => 'Tidak dapat menganalisis rekomendasi.'],
            'penyemprotan' => ['status' => 'tunda', 'warna' => 'merah', 'ikon' => '🧴', 'judul' => 'Tunda Penyemprotan', 'pesan' => 'Data cuaca tidak tersedia.'],
            'irigasi' => ['status' => 'perlu', 'warna' => 'kuning', 'ikon' => '💧', 'judul' => 'Irigasi — Perlu Diperhatikan', 'pesan' => 'Data cuaca tidak tersedia.', 'total_hujan_7hari' => 0],
        ];
    }

    private function curahHujanKeIkon(float $mm): string
    {
        return match(true) {
            $mm == 0          => '☀️',
            $mm < 1           => '🌤️',
            $mm < 5           => '⛅',
            $mm < 10          => '🌦️',
            $mm < 20          => '🌧️',
            default           => '⛈️',
        };
    }

    private function curahHujanKeKondisi(float $mm): string
    {
        return match(true) {
            $mm == 0  => 'Cerah',
            $mm < 1   => 'Berawan',
            $mm < 5   => 'Gerimis',
            $mm < 10  => 'Hujan ringan',
            $mm < 20  => 'Hujan sedang',
            default   => 'Hujan lebat',
        };
    }

    public function fallbackCuaca(): array
    {
        $log = weather_logs::latest('date')->first();

        $hariIni = [
            'tanggal'     => now()->toDateString(),
            'hari'        => now()->locale('id')->isoFormat('ddd'),
            'tanggal_indo'=> now()->locale('id')->isoFormat('D MMM'),
            'suhu'        => $log?->temperature ?? 27.5,
            'curah_hujan' => $log?->rainfall    ?? 5.0,
            'kelembapan'  => $log?->humidity    ?? 80.0,
            'ikon'        => '⛅',
            'kondisi'     => 'Data dari arsip lokal',
            'aman_semprot'=> true,
        ];
         // Pesan yang lebih informatif untuk pengguna desa
    $rekomendasiFallback = [
        'pemupukan' => [
            'status' => 'tunda',
            'warna'  => 'kuning',
            'ikon'   => '🌱',
            'judul'  => 'Pemupukan — Periksa Koneksi',
            'pesan'  => 'Prakiraan cuaca tidak dapat diambil saat ini. Pastikan perangkat terhubung ke internet untuk mendapatkan rekomendasi yang akurat.',
        ],
        'penyemprotan' => [
            'status' => 'tunda',
            'warna'  => 'kuning',  // ← kuning bukan merah karena bukan karena hujan
            'ikon'   => '🧴',
            'judul'  => 'Penyemprotan — Periksa Koneksi',
            'pesan'  => 'Rekomendasi tidak tersedia. Hubungkan perangkat ke internet untuk mendapatkan prakiraan cuaca terbaru.',
        ],
        'irigasi' => [
            'status' => 'perlu',
            'warna'  => 'kuning',
            'ikon'   => '💧',
            'judul'  => 'Irigasi — Periksa Koneksi',
            'pesan'  => 'Data cuaca tidak dapat diambil. Pantau kondisi tanah secara langsung hingga koneksi tersedia.',
            'total_hujan_7hari' => 0,
        ],
    ];

        return [
            'berhasil'    => false,
            'sumber'      => 'fallback',
            'hari_ini'    => $hariIni,
            'prakiraan'   => [],
            'rekomendasi' => $rekomendasiFallback,
        ];
    }
}