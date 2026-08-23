import { CheckCircle2, AlertTriangle, Info, Sprout, SprayCan, Droplet } from "lucide-react";
import type { RekomendasiItem } from "@/Lovable/types/DataCuaca";
interface Props {
    rekomendasi?: {
        pemupukan?: RekomendasiItem;
        penyemprotan?: RekomendasiItem;
        irigasi?: RekomendasiItem;
    };
}

export function KartuRekomendasi({ rekomendasi }: Props) {
    if (!rekomendasi) return null;
    const { pemupukan, penyemprotan, irigasi } = rekomendasi;

    const kelasWarna: Record<string, { bg: string; iconBg: string; text: string }> = {
        hijau: {
            bg: "bg-green-600/10 border-green-600/20",
            iconBg: "bg-green-600/20",
            text: "text-green-600",
        },
        kuning: {
            bg: "bg-yellow-600/10 border-yellow-600/20",
            iconBg: "bg-yellow-600/20",
            text: "text-yellow-600",
        },
        merah: {
            bg: "bg-red-600/10 border-red-600/20",
            iconBg: "bg-red-600/20",
            text: "text-red-600",
        },
        biru: {
            bg: "bg-blue-600/10 border-blue-600/20",
            iconBg: "bg-blue-600/20",
            text: "text-blue-600",
        },
        default: {
            bg: "bg-muted/50 border-muted",
            iconBg: "bg-muted",
            text: "text-muted-foreground"
        }
    };

    return (
        <div className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center justify-center gap-2">
                <Sprout className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold">Rekomendasi Berdasarkan Cuaca</h3>
            </div>

            <div className="mt-4 space-y-3">
                {/* Pemupukan */}
                {pemupukan && (
                    <div className={`rounded-2xl border p-4 transition-all ${kelasWarna[pemupukan.warna]?.bg || kelasWarna.default.bg}`}>
                        <div className="flex items-start gap-2.5">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${kelasWarna[pemupukan.warna]?.iconBg || kelasWarna.default.iconBg}`}>
                                <Sprout className={`h-4 w-4 ${kelasWarna[pemupukan.warna]?.text || kelasWarna.default.text}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold inline-flex items-center gap-1.5 ${kelasWarna[pemupukan.warna]?.text || kelasWarna.default.text}`}>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {pemupukan.judul}
                                </p>
                                <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed">
                                    {pemupukan.pesan}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Penyemprotan */}
                {penyemprotan && (
                    <div className={`rounded-2xl border p-4 transition-all ${kelasWarna[penyemprotan.warna]?.bg || kelasWarna.default.bg}`}>
                        <div className="flex items-start gap-2.5">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${kelasWarna[penyemprotan.warna]?.iconBg || kelasWarna.default.iconBg}`}>
                                <SprayCan className={`h-4 w-4 ${kelasWarna[penyemprotan.warna]?.text || kelasWarna.default.text}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold inline-flex items-center gap-1.5 ${kelasWarna[penyemprotan.warna]?.text || kelasWarna.default.text}`}>
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    {penyemprotan.judul}
                                </p>
                                <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed">
                                    {penyemprotan.pesan}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Irigasi */}
                {irigasi && (
                    <div className={`rounded-2xl border p-4 transition-all ${kelasWarna[irigasi.warna]?.bg || kelasWarna.default.bg}`}>
                        <div className="flex items-start gap-2.5">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${kelasWarna[irigasi.warna]?.iconBg || kelasWarna.default.iconBg}`}>
                                <span className="text-base">{irigasi.ikon || "💧"}</span>
                            </div>
                            <div>
                                <p className={`text-sm font-bold inline-flex items-center gap-1.5 ${kelasWarna[irigasi.warna]?.text || kelasWarna.default.text}`}>
                                    <Info className="h-3.5 w-3.5" />
                                    {irigasi.judul}
                                </p>
                                <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed">
                                    {irigasi.pesan}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}