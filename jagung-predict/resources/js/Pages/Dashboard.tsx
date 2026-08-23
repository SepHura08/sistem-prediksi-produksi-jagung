import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { KartuCuaca } from "@/Lovable/components/KartuCuaca";
import { GrafikProduksi } from "@/Lovable/components/GrafikProduksi";
import { KartuRekomendasi } from '@/Lovable/components/KartuRekomendasi';
import {
CheckCircle2,
  AlertTriangle,
  Info,
  CircleDot,
  Wheat,
  MapPin,
  CloudSun,
  CloudRain,
  Thermometer,
  Droplets,
  Sprout,
  SprayCan,
  Droplet,
  Satellite,
} from "lucide-react";

// Props dari Laravel Controller
interface Props {
    cuaca?: {
        berhasil: boolean;
        sumber: string;
        hari_ini: {
            suhu: number;
            curah_hujan: number;
            kelembapan: number;
            ikon: string;
            kondisi: string;
        };
        prakiraan: Array<{
            tanggal: string;
            hari: string;
            suhu: number;
            curah_hujan: number;
            ikon: string;
            kondisi: string;
        }>;
        rekomendasi: {
            pemupukan: { judul: string; pesan: string; warna: string; };
            penyemprotan: { judul: string; pesan: string; warna: string; };
            irigasi: { judul: string; pesan: string; warna: string; };
        };
    };
    prediksiTerakhir?: Array<{
        id: number;
        land_area: number;
        estimated_ton: number;
        actual_ton: number | null;
        created_at: string;
    }>;
     totalEstimasi?: number;
      totalLuasLahan?: number;
}


export default function Dashboard({ cuaca, prediksiTerakhir = [],totalEstimasi,totalLuasLahan }: Props) {
    const { auth } = usePage().props as any;
    const hariIni = cuaca?.hari_ini;
    const prakiraan = cuaca?.prakiraan ?? [];
    const rekomendasi = cuaca?.rekomendasi ?? {
      pemupukan: {
        status: 'tidak_diketahui',
        warna: 'abu',
        ikon: '🌱',
        judul: 'Memuat data...',
        pesan: 'Sedang mengambil data cuaca',
    },
    penyemprotan: {
        status: 'tidak_diketahui',
        warna: 'abu',
        ikon: '🧴',
        judul: 'Memuat data...',
        pesan: 'Sedang mengambil data cuaca',
    },
    irigasi: {
        status: 'tidak_diketahui',
        warna: 'abu',
        ikon: '💧',
        judul: 'Memuat data...',
        pesan: 'Sedang mengambil data cuaca',
    },
    }
    

    return (
        <AuthenticatedLayout header="Dashboard Ketahanan Pangan">
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
                <div className="space-y-6">
                    {/* Header card */}
                    <div className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 overflow-hidden">
                        {/* ... isi dari Lovable ... */}
                       
                        
                        {/* Ganti data statis dengan props */}

                        {/* Status cuaca dari API */}
                        {hariIni && (
                           <div className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(var(--color-primary) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary/80 uppercase">
                <Sprout className="h-4 w-4" />
                Musim Tanam 2025
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight font-[var(--font-display)]">
                Selamat Datang Kembali, {auth.user.name}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Pantau estimasi dan realisasi panen desa secara real-time.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="group rounded-2xl border border-border p-4 bg-gradient-to-br from-accent/40 to-transparent hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-medium">Total Estimasi</p>
                    <div className="h-9 w-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Wheat className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-bold"> {(totalEstimasi ?? 0) > 0 ? Number (totalEstimasi ?? 0).toFixed(1) : "0"} <span className="text-base font-medium text-muted-foreground">Ton</span></p>
                  <p className="mt-2 text-xs text-muted-foreground">Periode 2025</p>
                </div>
                <div className="group rounded-2xl border border-border p-4 bg-gradient-to-br from-orange-300/20 to-transparent hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-medium">Luas Lahan</p>
                    <div className="h-9 w-9 rounded-xl bg-tanah/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-tanah" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-bold">{(totalLuasLahan ?? 0 ) > 0 ? Number (totalLuasLahan ?? 0)?.toFixed(1) : "0"}<span className="text-base font-medium text-muted-foreground"> Hektar</span></p>
                  <p className="mt-2 text-xs text-muted-foreground">Aktif mengelola</p>
                </div>
                <div className="group rounded-2xl border border-border p-4 bg-gradient-to-br from-langit/30 to-transparent">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-medium">Status Cuaca</p>
                    <div className="h-9 w-9 rounded-xl bg-langit/20 flex items-center justify-center">
                      <CloudSun className="h-4 w-4 text-langit" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <CloudRain className="h-3 w-3 text-langit" /> Curah Hujan
                      </span>
                      <span className="font-semibold text-primary">{hariIni.curah_hujan}mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Thermometer className="h-3 w-3 text-orange-500" /> Suhu
                      </span>
                      <span className="font-semibold text-primary">{hariIni.suhu}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Droplets className="h-3 w-3 text-blue-500" /> Kelembapan
                      </span>
                      <span className="font-semibold text-primary">{hariIni.kelembapan}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
       )}
                    </div>

                    {/* Grafik dari data historis */}
                    <GrafikProduksi data={prediksiTerakhir} />
                </div>

                <div className="space-y-6">
                    {/* Prakiraan cuaca */}
                    <KartuCuaca prakiraan={prakiraan} />

                    {/* Rekomendasi dari API */}
                    {/* {rekomendasi && (
                        <div className="rounded-3xl border border-border bg-card p-5">
                            <h3 className="text-sm font-bold mb-4">
                                Rekomendasi Berdasarkan Cuaca
                            </h3>
                            <div className="space-y-3">
                                {Object.values(rekomendasi).map((reko, i) => (
                                    <div key={i} className="rounded-2xl border p-4">
                                        <p className="text-sm font-bold"> {reko.judul}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {reko.pesan}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    
                    )} */}
                       <KartuRekomendasi rekomendasi={rekomendasi} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}