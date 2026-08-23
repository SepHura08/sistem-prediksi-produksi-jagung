import { MenuButton } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, TrendingUp, History, User } from "lucide-react";

const menu = [
  { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "Prediksi", url: "/prediksi", icon: TrendingUp },
  { label: "Historis", url: "/historis", icon: History },
  { label: "Profil", url: "/", icon: User },
];

export function BottomNav() {
  const { url } = usePage();

  return (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
            <div className="grid grid-cols-4">
                {MenuButtom.map((item) => {
                    const aktif = url.startsWith(item.url);
                    return (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                                aktif ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <div className={cn(
                                'h-9 w-12 rounded-xl flex items-center justify-center transition-colors',
                                aktif && 'bg-primary/10'
                            )}>
                                <item.icon className="h-[18px] w-[18px]" />
                            </div>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
