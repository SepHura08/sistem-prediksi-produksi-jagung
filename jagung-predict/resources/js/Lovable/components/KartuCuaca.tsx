import type { PrakiraanHarian } from "@/Lovable/types/DataCuaca";

interface PropsKartuCuaca {
    prakiraan: PrakiraanHarian[];
}

export function KartuCuaca({ prakiraan }: PropsKartuCuaca) {
    if (!prakiraan || prakiraan.length === 0) {
        return (
            <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold">Prakiraan 7 Hari Ke Depan</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Dasar rekomendasi operasional petani
                </p>
                <div className="rounded-2xl bg-muted/40 border border-dashed border-border p-6 text-center">
                    <p className="text-2xl mb-2">📡</p>
                    <p className="text-sm font-semibold text-foreground">
                        Prakiraan tidak tersedia
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Hubungkan perangkat ke internet untuk
                        melihat prakiraan cuaca 7 hari ke depan
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="rounded-3xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold">Prakiraan 7 Hari Ke Depan</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
                Dasar rekomendasi operasional petani
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-7 xl:grid-cols-4 gap-1.5 sm:gap-2">
                {prakiraan.slice(0, 7).map((hari) => (
                    <div
                        key={hari.tanggal}
                        className="rounded-xl border border-border p-2 text-center bg-background hover:border-primary/30 transition-colors"
                    >
                        <p className="text-[10px] font-bold text-muted-foreground tracking-wider">
                            {hari.hari}
                        </p>
                        <p className="text-lg sm:text-sm font-bold mt-1">
                            {hari.ikon}
                        </p>
                        <p className="text-sm font-bold text-primary">
                            {hari.suhu}°
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {hari.curah_hujan}mm  {/* ← snake_case */}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}