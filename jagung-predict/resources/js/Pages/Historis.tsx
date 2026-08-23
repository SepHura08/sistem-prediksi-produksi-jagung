import { Head, router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import {
    Download, FileEdit, Save,
    TrendingUp, TrendingDown, Minus,
    Wheat, Calendar, Ruler
} from "lucide-react";
import { useState } from "react";

interface ItemHistoris {
    id: string;
    tanggal: string;
    luasLahan: number;
    estimasiProduksi: number;
    aktual: number | null;
    harvest_year: number | null;
    selisih: number | null;
    
}

interface Paginasi {
    data: ItemHistoris[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    riwayat: Paginasi;
}

export default function Historis({ riwayat }: Props) {
    const [idDipilih, setIdDipilih] = useState<string | null>(null);
    const [hasilAktual, setHasilAktual] = useState("");
    const [tahunPanen, setTahunPanen] = useState("");
    const [sedangSimpan, setSedangSimpan] = useState(false);

    const { flash } = usePage<PageProps &{
        flash?: { berhasil?: string }
    }>().props;

    const simpanAktual = (id: string) => {
        if (!hasilAktual || !tahunPanen) return;
        setSedangSimpan(true);

        router.post(route('prediksi.aktual', id), {
            actual_ton:   parseFloat(hasilAktual),
            harvest_year: parseInt(tahunPanen),
        }, {
            onFinish: () => {
                setSedangSimpan(false);
                setIdDipilih(null);
                setHasilAktual("");
                setTahunPanen("");
            },
        });
    };

    const badgeSelisih = (selisih: number | null) => {
        if (selisih === null) return (
            <span className="text-xs text-muted-foreground">Belum ada</span>
        );
        if (selisih > 0) return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <TrendingUp className="h-3 w-3" /> +{selisih}
            </span>
        );
        if (selisih < 0) return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
                <TrendingDown className="h-3 w-3" /> {selisih}
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                <Minus className="h-3 w-3" /> 0
            </span>
        );
    };

    return (
        <Authenticated header="Data Historis">
            <Head title="Data Historis" />

            <div className="space-y-6">

                {/* Flash message */}
                {flash?.berhasil && (
                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-sm text-primary font-medium">
                        {flash.berhasil}
                    </div>
                )}

                {/* Input hasil panen aktual */}
                <div className="rounded-3xl border border-border bg-card p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileEdit className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Input Hasil Panen Aktual</h3>
                            <p className="text-xs text-muted-foreground">
                                Catat realisasi panen setelah musim panen selesai
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Pilih prediksi */}
                        <div>
                            <label className="block text-xs font-bold tracking-wide text-muted-foreground mb-2">
                                PILIH PREDIKSI
                            </label>
                            <select
                                value={idDipilih ?? ""}
                                onChange={(e) => setIdDipilih(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                <option value="">Pilih tanggal prediksi</option>
                                {riwayat.data
                                    .filter(d => d.aktual === null)
                                    .map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.tanggal} — {d.luasLahan} Ha
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Tahun panen */}
                        <div>
                            <label className="block text-xs font-bold tracking-wide text-muted-foreground mb-2">
                                TAHUN PANEN
                            </label>
                            <input
                                type="number"
                                value={tahunPanen}
                                onChange={(e) => setTahunPanen(e.target.value)}
                                placeholder="Contoh: 2025"
                                min="2000"
                                max="2099"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Hasil aktual */}
                        <div>
                            <label className="block text-xs font-bold tracking-wide text-muted-foreground mb-2">
                                HASIL AKTUAL (TON)
                            </label>
                            <input
                                type="number"
                                value={hasilAktual}
                                onChange={(e) => setHasilAktual(e.target.value)}
                                placeholder="Contoh: 55"
                                min="0.1"
                                step="0.1"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button
                            onClick={() => idDipilih && simpanAktual(idDipilih)}
                            disabled={!idDipilih || !hasilAktual || !tahunPanen || sedangSimpan}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="h-4 w-4" />
                            {sedangSimpan ? "Menyimpan..." : "Simpan Data"}
                        </button>
                    </div>
                </div>

                {/* Tabel */}
                <div className="rounded-3xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between p-5 sm:p-6">
                        <div>
                            <h3 className="text-lg font-bold">Riwayat Prediksi & Panen Aktual</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total {riwayat.total} data prediksi
                            </p>
                        </div>
                        
                            <a href={route('historis.ekspor')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted transition-colors"
                        >
                            <Download className="h-4 w-4" /> Ekspor CSV
                        </a>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                                    <th className="text-left font-semibold px-5 py-3">Tahun</th>
                                    <th className="text-left font-semibold px-5 py-3">Tanggal</th>
                                    <th className="text-left font-semibold px-5 py-3">Luas (Ha)</th>
                                    <th className="text-left font-semibold px-5 py-3">Estimasi (Ton)</th>
                                    <th className="text-left font-semibold px-5 py-3">Aktual (Ton)</th>
                                    <th className="text-left font-semibold px-5 py-3">Selisih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riwayat.data.map((d) => (
                                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                        <td className="px-5 py-4 text-sm">{d.harvest_year}</td>
                                        <td className="px-5 py-4 text-sm">{d.tanggal}</td>
                                        <td className="px-5 py-4 text-sm">{d.luasLahan}</td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                                {d.estimasiProduksi}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            {d.aktual ?? (
                                                <span className="text-muted-foreground text-xs">Belum diisi</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {badgeSelisih(d.selisih)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    {/* Mobile — versi yang mudah dibaca masyarakat desa */}
<div className="md:hidden divide-y divide-border border-t border-border">
    {riwayat.data.map((d) => (
        <div key={d.id} className="p-4 space-y-3">

            {/* Baris atas: tanggal + luas lahan */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Wheat className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{d.harvest_year}</p>
                        <p className="text-xs text-muted-foreground">
                            Luas lahan: <span className="font-semibold text-foreground">{d.luasLahan} Ha</span>
                        </p>
                    </div>
                </div>
                {/* Badge selisih hanya muncul kalau ada aktual */}
                {d.selisih !== null && badgeSelisih(d.selisih)}
            </div>

            {/* Baris bawah: estimasi vs aktual */}
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                        Estimasi Panen
                    </p>
                    <p className="text-xl font-bold">
                        {d.estimasiProduksi}
                        <span className="text-xs text-muted-foreground font-normal ml-1">ton</span>
                    </p>
                </div>

                <div className={`rounded-xl p-3 ${
                    d.aktual !== null
                        ? 'bg-primary/10'
                        : 'bg-muted/30 border border-dashed border-border'
                }`}>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                        Hasil Aktual
                    </p>
                    {d.aktual !== null ? (
                        <p className="text-xl font-bold text-primary">
                            {d.aktual}
                            <span className="text-xs text-muted-foreground font-normal ml-1">ton</span>
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            Belum diisi
                        </p>
                    )}
                </div>
            </div>
        </div>
    ))}
</div>

                    {/* Pagination */}
                    {riwayat.last_page > 1 && (
                        <div className="flex justify-center gap-2 p-5 border-t border-border">
                            {Array.from({ length: riwayat.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.get(route('historis'), { page })}
                                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-colors ${
                                        page === riwayat.current_page
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Authenticated>
    );
}