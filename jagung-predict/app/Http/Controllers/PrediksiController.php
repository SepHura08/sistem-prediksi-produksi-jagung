<?php

namespace App\Http\Controllers;

use App\Models\predictions;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PrediksiController extends Controller
{

    public function tampilkan()
    {
        $riwayat = predictions::where('user_id', auth()->id())
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($p) => [
                'id'               => (string) $p->id,
                'tanggal'          => $p->created_at->format('Y-m-d'),
                'luasLahan'        => (float) $p->land_area,
                'estimasiProduksi' => (float) $p->estimated_ton,
            ]);

        return Inertia::render('Prediksi', [
            'riwayat' => $riwayat,
            'mae'     => config('prediksi.model.mae'),
            'prediksi_error' => session('prediksi_error'),

        ]);
    }
    //Menerima input luas lahan
    public function proses(Request $request)
    {
        $request->validate([
            'luas_lahan' => ['required', 'numeric', 'min:0.1', 'max:500'],
        ], [
            'luas_lahan.required' => 'Luas lahan wajib diisi.',
            'luas_lahan.numeric'  => 'Luas lahan harus berupa angka.',
            'luas_lahan.min'      => 'Luas lahan minimal 0.1 hektar.',
            'luas_lahan.max'      => 'Luas lahan maksimal 500 hektar.',
        ]);


        $paramCuaca = $this->ambilParameterCuaca();

        //mengirim data Flask API
        $payload = [
            'curah_hujan' => $paramCuaca['curah_hujan'],
            'suhu'        => $paramCuaca['suhu'],
            'luas_panen'  => (float) $request->luas_lahan,
            'kelembapan'  => $paramCuaca['kelembapan'],
        ];

        $estimasi = $this->kirimKeFlask($payload);

        if ($estimasi === null) {
        

            return back()->with([
                'prediksi_error' =>
                'Prediksi sementara tidak tersedia karena layanan model sedang mengalami gangguan.'
            ]);
        }
        //menerima hasil prediksi :
        predictions::create([
            'user_id'       => auth()->id(),
            'land_area'     => (float) $request->luas_lahan,
            'estimated_ton' => $estimasi,
            'data_source'   => $paramCuaca['sumber'],
        ]);

        //Mengirim Hasil ke Halaman
        return back()->with([
            'berhasil'      => true,
            'estimasi_ton'  => $estimasi,
            'margin_error'  => config('prediksi.model.mae'),
            'rentang_bawah' => round($estimasi - config('prediksi.model.mae'), 2),
            'rentang_atas'  => round($estimasi + config('prediksi.model.mae'), 2),
        ]);
    }
    //Menyimpan hasil panen
    public function simpanAktual(Request $request, int $id)
    {
        $request->validate([
            'actual_ton'   => ['required', 'numeric', 'min:0.1'],
            'harvest_year' => ['required', 'digits:4', 'integer'],
        ]);

        $prediksi = predictions::where('user_id', auth()->id())
            ->findOrFail($id);

        $prediksi->update([
            'actual_ton'   => $request->actual_ton,
            'harvest_year' => $request->harvest_year,
        ]);

        return back()->with('berhasil', 'Data panen aktual berhasil disimpan.');
    }

    public function historis()
    {
        $riwayat = predictions::where('user_id', auth()->id())
            ->latest()
            ->paginate(15)
            ->through(fn($p) => [
                'id'               => (string) $p->id,
                'tanggal'          => $p->created_at->format('Y-m-d'),
                'luasLahan'        => (float) $p->land_area,
                'estimasiProduksi' => (float) $p->estimated_ton,
                'aktual'           => $p->actual_ton ? (float) $p->actual_ton : null,
                'harvest_year'     => $p->harvest_year,
                'selisih'          => $p->actual_ton
                    ? round((float) $p->actual_ton - (float) $p->estimated_ton, 2)
                    : null,
            ]);

        return Inertia::render('Historis', [
            'riwayat' => $riwayat,
        ]);
    }

    public function eksporCSV()
    {
        $data     = predictions::where('user_id', auth()->id())->latest()->get();
        $namaFile = 'prediksi_' . now()->format('Y_m_d') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename={$namaFile}",
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Tanggal', 'Luas Lahan (Ha)', 'Estimasi (Ton)', 'Aktual (Ton)', 'Selisih (Ton)']);
            foreach ($data as $p) {
                $selisih = $p->actual_ton
                    ? round(abs($p->estimated_ton - $p->actual_ton), 2)
                    : '-';
                fputcsv($file, [
                    $p->created_at->format('Y-m-d'),
                    $p->land_area,
                    $p->estimated_ton,
                    $p->actual_ton ?? '-',
                    $selisih,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function ambilParameterCuaca(): array
    {
        return [
            'curah_hujan' => config('prediksi.cuaca_default.curah_hujan'),
            'suhu'        => config('prediksi.cuaca_default.suhu'),
            'kelembapan'  => config('prediksi.cuaca_default.kelembapan'),
            'sumber'      => 'historic_avg',
        ];
    }

    private function kirimKeFlask(array $payload): ?float
    {
        try {
            $respons = Http::timeout(10)
                ->post(config('prediksi.flask_api_url') . '/prediksi', $payload);

            if ($respons->successful() && $respons->json('berhasil')) {
                return (float) $respons->json('estimasi_ton');
            }
            return null;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return null;
        }
    }


    public function destroy(predictions $predictions)
    {
        abort_if($predictions->user_id != auth()->id(), 403);
        $predictions->delete();
        return back()->with('success', 'Data Berhasil Dihapus');
    }
}
