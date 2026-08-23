import { cn } from "@/lib/utils";
import { Link, usePage, router } from "@inertiajs/react";
import { LayoutDashboard, TrendingUp, History, HelpCircle, LifeBuoy, LogOut, Tractor, X } from "lucide-react";


interface PropsSidebar {
  terbuka?: boolean;
  alihkanSidebar?: () => void;
}

const menuUtama = [
  { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "Prediksi Produksi", url: "/prediksi", icon: TrendingUp },
  { label: "Data Historis", url: "/historis", icon: History },
];

export function Sidebar({ terbuka = false, alihkanSidebar }: PropsSidebar) {
  const { url } = usePage(); 
 

  const tanganiLogout = () => {
    navigate({ to: "/" });
  };

  return (
    <>
      {terbuka && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={alihkanSidebar}
        />
      )}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-card border-r border-border flex flex-col transition-transform duration-300",
          terbuka ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center">
              <Tractor className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SIPERTANI</h1>
              <p className="text-xs text-muted-foreground">Managem Dashboard</p>
            </div>
          </div>
          <button onClick={alihkanSidebar} className="lg:hidden p-1 rounded-md hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {menuUtama.map((item) => {
            const aktif = url === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={alihkanSidebar}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative",
                  aktif
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {aktif && <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />}
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-1 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <HelpCircle className="h-5 w-5" />
            <span>Bantuan</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <LifeBuoy className="h-5 w-5" />
            <span>Dukungan</span>
          </button>
          <button
            onClick={tanganiLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
