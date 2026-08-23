import {
    Bar, BarChart, CartesianGrid,
    ResponsiveContainer, Tooltip, XAxis, YAxis, Cell
} from "recharts";
import type { ItemPrediksi } from "@/Lovable/types/DataHistoris";

interface PropsGrafikProduksi {
    data: ItemPrediksi[];
}

// GrafikProduksi.tsx — logic yang benar

export function GrafikProduksi({ data }: PropsGrafikProduksi) {

    // Hanya tampilkan data yang SUDAH ada aktualnya
    const dataAktual = data.filter(item => item.actual_ton !== null);

    // Kelompokkan berdasarkan harvest_year
    const dataGrafik = dataAktual.map((item) => ({
        tahun: item.harvest_year?.toString() ?? '-',
        estimasiProduksi: Number(item.estimated_ton),
        aktual: Number(item.actual_ton),
        land_area: item.land_area,
    }));

    if (dataGrafik.length === 0) {
        return (
            <div className="rounded-3xl border border-border bg-card p-7 text-center space-y-2">
                <p className="text-sm font-semibold text-foreground">
                    Grafik belum tersedia
                </p>
                <p className="text-xs text-muted-foreground">
                    Grafik akan muncul setelah data panen aktual diinput
                    di halaman Data Historis.
                </p>
            </div>
        );
    }

    // Custom Tooltip yang benar
    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) return null;
        const d = payload[0]?.payload;
        const selisih = d.aktual - d.estimasiProduksi;
        return (
            <div className="bg-card border border-border rounded-2xl p-3 shadow-lg text-xs min-w-[160px] space-y-1.5">
                <p className="font-bold text-sm">Tahun {d.tahun}</p>
                <p className="text-muted-foreground">Luas lahan: {d.land_area} Ha</p>
                <div className="border-t border-border pt-1.5 space-y-1">
                    <div className="flex justify-between gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-sm bg-[#023020] inline-block"/>
                            Estimasi
                        </span>
                        <span className="font-semibold">{d.estimasiProduksi} ton</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-sm bg-[#8FBC8F] inline-block"/>
                            Aktual
                        </span>
                        <span className="font-semibold">{d.aktual} ton</span>
                    </div>
                    <div className="flex justify-between gap-4 pt-1 border-t border-border">
                        <span className="text-muted-foreground">Selisih</span>
                        <span className={`font-semibold ${selisih >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {selisih >= 0 ? '+' : ''}{selisih.toFixed(2)} ton
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-lg sm:text-xl font-bold">
                    Grafik Perbandingan Estimasi vs Aktual
                </h3>
                <div className="flex items-center gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-[#023020] inline-block"/>
                        <span className="text-muted-foreground">Estimasi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-[#8FBC8F] inline-block"/>
                        <span className="text-muted-foreground">Aktual</span>
                    </div>
                </div>
            </div>
            <div className="h-72 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataGrafik} barCategoryGap="30%" barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                        <XAxis
                            dataKey="tahun"
                            stroke="var(--muted-foreground)"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11 }}
                            unit=" t"
                        />
                        <Tooltip content={<CustomTooltip />}/>
                        <Bar dataKey="estimasiProduksi" name="Estimasi" fill="#023020" radius={[6,6,0,0]}/>
                        <Bar dataKey="aktual" name="Aktual" fill="#8FBC8F" radius={[6,6,0,0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}