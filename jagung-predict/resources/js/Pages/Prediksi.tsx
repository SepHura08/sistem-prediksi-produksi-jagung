import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { TabelRiwayat } from "@/Lovable/components/TabelRiwayat";
import type { DataPrediksi } from "@/Lovable/types/DataPrediksi";
import type { PageProps } from "@/types";
import {
    FileEdit,
    BarChart3,
    Leaf,
    Ruler,
    FileSpreadsheet,
    ArrowRight,
    Loader2,
    AlertCircle,
} from "lucide-react";

interface FlashProps extends PageProps {
    flash?: {
        berhasil?: boolean;
        estimasi_ton?: number;
        margin_error?: number;
        rentang_bawah?: number;
        rentang_atas?: number;
        prediksi_error?:string;
    };
}
//props dari controller
interface Props {
    riwayat: DataPrediksi[];
    mae: number;
     prediksi_error?: string;
}

export default function Prediksi({ riwayat = [], mae = 26.58, prediksi_error }: Props) {
    // Ambil flash dari Inertia share props
    const { flash } = usePage<FlashProps>().props;
    
    const estimasi = flash?.estimasi_ton;


    const [luasLahan, setLuasLahan] = useState("");
    const [sedangProses, setSedangProses] = useState(false);
    const [error, setError] = useState("");

    // // Tambahkan sementara di Prediksi.tsx untuk debug
    // console.log('Flash:', flash);
    // console.log('Estimasi:', estimasi);

    const handlePrediksi = () => {
        const luas = parseFloat(luasLahan);

        // Validasi di frontend
        if (!luasLahan || isNaN(luas)) {
            setError("Luas lahan harus diisi dengan angka.");
            return;
        }
        if (luas <= 0) {
            setError("Luas lahan harus lebih dari 0.");
            return;
        }
        if (luas > 500) {
            setError("Luas lahan maksimal 500 hektar.");
            return;
        }

        setError("");
        setSedangProses(true);

        // Kirim ke Laravel → Flask API
        router.post(
            route("prediksi.proses"),
            {
                luas_lahan: luas,
            },
            {
                preserveScroll: true,
                preserveState: false,
                onFinish: () => setSedangProses(false),
                onError: (errors) => {
                    setSedangProses(false);
                    setError(errors.luas_lahan ?? "Terjadi kesalahan.");
                },
            },
        );
    };

    return (
        <Authenticated header="Prediksi Produksi Jagung">
            <Head title="Prediksi Produksi" />

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                    {/* Input Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 flex flex-col">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FileEdit className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold">
                                Input Luas Lahan
                            </h3>
                        </div>

                        <div className="mt-6 flex-1">
                            <label className="block text-xs font-bold tracking-wide text-muted-foreground mb-2">
                                LUAS LAHAN (HA)
                            </label>
                            <div className="relative">
                                <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    value={luasLahan}
                                    onChange={(e) => {
                                        setLuasLahan(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Contoh: 38"
                                    min="0.1"
                                    max="500"
                                    step="0.1"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>

                            {error && (
                                <div className="mt-2 flex items-center gap-2 text-destructive text-xs">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {error}
                                </div>
                            )}

                            <p className="mt-3 text-xs text-muted-foreground">
                                Estimasi menggunakan model Random Forest dengan
                                data historis 2003–2024. Margin kesalahan ±{mae}{" "}
                                ton.
                            </p>
                        </div>

                        <button
                            onClick={handlePrediksi}
                            disabled={sedangProses}
                            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20 w-full"
                        >
                            {sedangProses ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Menghitung...
                                </>
                            ) : (
                                <>
                                    <BarChart3 className="h-4 w-4" />
                                    PREDIKSI PRODUKSI
                                </>
                            )}
                        </button>
                    </div>

                    {/* card Hasil Estimasi */}
                    <div className="space-y-6">
                        <div className="relative rounded-3xl bg-primary text-primary-foreground p-8 overflow-hidden">
                            <div
                                className="absolute inset-0 opacity-[0.08]"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(white 1px, transparent 1px)",
                                    backgroundSize: "16px 16px",
                                }}
                            />

                            <div className="relative text-center">
                                <Leaf className="h-10 w-10 mx-auto opacity-80" />

                                <p className="mt-3 text-sm font-semibold tracking-wider opacity-90">
                                    ESTIMASI HASIL PANEN
                                </p>

                                {prediksi_error ? (
                                    <>
                                        <div className="mt-5">
                                            <span className="text-5xl">⚠️</span>
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-red-300">
                                            Prediksi tidak tersedia
                                        </p>

                                        <p className="mt-2 text-xs opacity-80">
                                            {prediksi_error}
                                        </p>
                                    </>
                                ) : estimasi !== undefined &&
                                  estimasi !== null ? (
                                    <>
                                        <div className="mt-3 flex items-baseline justify-center gap-2">
                                            <span className="text-6xl sm:text-7xl font-bold">
                                                {Number(estimasi).toFixed(1)}
                                            </span>

                                            <span className="text-2xl font-medium opacity-80">
                                                Ton
                                            </span>
                                        </div>

                                        <p className="mt-3 text-xs opacity-70">
                                            Rentang: {flash?.rentang_bawah}
                                            {" - "}
                                            {flash?.rentang_atas} ton
                                        </p>

                                        <p className="mt-1 text-xs opacity-60">
                                            Margin kesalahan ±
                                            {flash?.margin_error} ton
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-3 flex items-baseline justify-center gap-2">
                                            <span className="text-6xl sm:text-7xl font-bold opacity-30">
                                                —
                                            </span>
                                        </div>

                                        <p className="mt-4 text-xs opacity-70">
                                            Masukkan luas lahan kemudian tekan
                                            tombol prediksi
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                Model: Random Forest Regressor • MAE: {mae} ton
                                • R²: 0.948 • Data: BPS Kec. Idanogawo 2003–2024
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabel Riwayat */}
                <div className="rounded-3xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between p-5 sm:p-6">
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold">
                                5 Prediksi Terakhir
                            </h3>
                        </div>

                        <a
                            href={route("historis")}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                            Lihat Semua <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                    <TabelRiwayat daftar={riwayat} />
                </div>
            </div>
        </Authenticated>
    );
}
