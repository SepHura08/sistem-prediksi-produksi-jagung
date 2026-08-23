import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";


interface PropsKartuStatistik {
  label: string;
  nilai: string;
  keterangan?: string;
  ikon?: LucideIcon;
  varian?: "default" | "primer";
}

export function KartuStatistik({ label, nilai, keterangan, ikon: Ikon, varian = "default" }: PropsKartuStatistik) {
  return (
    <div className={cn(
      "rounded-2xl border border-border p-5 bg-card transition-all hover:shadow-md",
      varian === "primer" && "bg-primary/5 border-primary/20"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{nilai}</p>
          {keterangan && <p className="mt-2 text-xs text-muted-foreground">{keterangan}</p>}
        </div>
        {Ikon && (
          <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <Ikon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
