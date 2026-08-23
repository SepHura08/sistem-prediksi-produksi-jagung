import { Eye, Calendar, Ruler, Wheat,  Trash2 } from "lucide-react";
import type { DataPrediksi } from "@/Lovable/types/DataPrediksi";
import { router } from "@inertiajs/react";
import Prediksi from "@/Pages/Prediksi";

interface PropsTabelRiwayat {
  daftar: DataPrediksi[];
}

export function TabelRiwayat({ daftar }: PropsTabelRiwayat) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="text-left font-semibold px-5 py-3">Tanggal</th>
              <th className="text-left font-semibold px-5 py-3">Luas Lahan (Ha)</th>
              <th className="text-left font-semibold px-5 py-3">Estimasi Produksi (Ton)</th>
              <th className="text-right font-semibold px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftar.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-5 py-4 text-sm">{item.tanggal}</td>
                <td className="px-5 py-4 text-sm">{Number(item.luasLahan).toFixed(1)}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {Number(item.estimasiProduksi).toFixed(1)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="inline-flex p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => {
                    if (confirm("Hapus data?")) {
                      router.delete(route("predictions.destroy", item.id))
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-border">
        {daftar.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Wheat className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{item.tanggal}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Ruler className="h-3 w-3" />
                <span>{Number(item.luasLahan).toFixed(1)} Ha</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Estimasi</p>
              <p className="text-base font-bold text-primary">
                {Number(item.estimasiProduksi).toFixed(1)}<span className="text-xs text-muted-foreground ml-1">t</span>
              </p>
            </div>
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
