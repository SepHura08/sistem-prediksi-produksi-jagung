import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import type { PageProps } from '@/types';
import LogoImage from '../Lovable/assets/logo7.png'; 
import {
    LayoutDashboard, TrendingUp, History,
    HelpCircle, LifeBuoy, LogOut, Tractor, X,
    Bell, Settings, User
} from 'lucide-react';

// ─── cn utility (kalau belum ada di Laravel) ───────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}

// ══════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════
const menuUtama = [
    { label: 'Dashboard',        url: '/dashboard', icon: LayoutDashboard },
    { label: 'Prediksi Produksi', url: '/prediksi',  icon: TrendingUp },
    { label: 'Data Historis',    url: '/historis',  icon: History },
];

function Sidebar({ terbuka, alihkanSidebar }: { terbuka: boolean; alihkanSidebar: () => void }) {
    const { url } = usePage();

    const tanganiLogout = () => {
        router.post(route('logout'));
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
                    'fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-card border-r border-border flex flex-col transition-transform duration-300',
                    terbuka ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Logo */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-16 w-16 rounded-full bg-primary  flex items-center justify-center shadow-lg shadow-primary/30">
                          
    <img
        src={LogoImage}
        alt="Logo"
        className="h-12 w-12 object-contain"
    /> 
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">SIPERTANI</h1>
                            <p className="text-xs text-muted-foreground">Management Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={alihkanSidebar}
                        className="lg:hidden p-1 rounded-md hover:bg-muted"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-2 space-y-1">
                    {menuUtama.map((item) => {
                        const aktif = url.startsWith(item.url);
                        return (
                            <Link
                                key={item.url}
                                href={item.url}
                                onClick={alihkanSidebar}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative',
                                    aktif
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                {aktif && (
                                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                                )}
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
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

// ══════════════════════════════════════════════
// HEADER
// ══════════════════════════════════════════════
function Header({
    judul,
    alihkanSidebar,
}: {
    judul: ReactNode;
    alihkanSidebar: () => void;
}) {
    const { auth } = usePage<PageProps>().props
    const nama = auth?.user?.name ?? 'Pengguna';
    const peran = 'User';

    return (
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4 gap-3">
                {/* Hamburger + Judul */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button
                        onClick={alihkanSidebar}
                        className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {judul && (
                        <h2 className="text-base sm:text-2xl font-bold tracking-tight text-primary truncate">
                            {judul}
                        </h2>
                    )}
                </div>

                {/* Kanan: Bell, Settings, Avatar */}
                <div className="flex items-center gap-1.5 sm:gap-4">
                    <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
                        {/* <Bell className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-muted-foreground" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" /> */}
                    </button>
                    <button className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:block">
                        {/* <Settings className="h-5 w-5 text-muted-foreground" /> */}
                    </button>
                    <Link
                        href={route('profile.edit')}
                        className="hidden md:block text-right hover:opacity-80 transition-opacity"
                    >
                        <p className="text-sm font-semibold leading-tight">{nama}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{peran}</p>
                    </Link>
                    <Link href={route('profile.edit')}>
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                            {nama.charAt(0).toUpperCase()}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}

// ══════════════════════════════════════════════
// BOTTOM NAV
// ══════════════════════════════════════════════
const menuBottom = [
    { label: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { label: 'Prediksi',  url: '/prediksi',  icon: TrendingUp },
    { label: 'Historis',  url: '/historis',  icon: History },
    { label: 'Profil',    url: '/profile',   icon: User },
];

function BottomNav() {
    const { url } = usePage();

    return (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
            <div className="grid grid-cols-4">
                {menuBottom.map((item) => {
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

// ══════════════════════════════════════════════
// LAYOUT UTAMA — Authenticated
// ══════════════════════════════════════════════
export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [sidebarTerbuka, setSidebarTerbuka] = useState(false);

    return (
        <div className="min-h-screen flex w-full bg-muted/30">
            <Sidebar
                terbuka={sidebarTerbuka}
                alihkanSidebar={() => setSidebarTerbuka((prev) => !prev)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    judul={header}
                    alihkanSidebar={() => setSidebarTerbuka((prev) => !prev)}
                />

                <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8">
                    {children}
                </main>

                <footer className="hidden lg:flex px-4 sm:px-8 py-5 border-t border-border text-xs text-muted-foreground flex-col sm:flex-row sm:justify-between gap-2">
                    <span>© 2024 SIPERTANI. Sistem Informasi Prediksi Pertanian.</span>
                    <span className="flex gap-4">
                        <span className="text-primary font-medium">v2.4.1-stable</span>
                        <a href="#" className="hover:text-foreground">Terms of Service</a>
                        <a href="#" className="hover:text-foreground">Support</a>
                    </span>
                </footer>
            </div>

            <BottomNav />
        </div>
    );
}