// resources/js/Pages/Welcome.tsx
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import LogoImage from '@/Lovable/assets/logo7.png'
import {
    Tractor,
    Sprout,
    CloudSun,
    TrendingUp,
    BarChart3,
    ArrowRight,
    CheckCircle2,
    MapPin,
    ShieldCheck,
    Smartphone,
} from "lucide-react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="SIPERTANI - Prediksi Panen Jagung" />
            <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
                {/* Background decoratif */}
                <div className="fixed inset-0 pointer-events-none -z-10">
                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage: "radial-gradient(var(--primary) 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div
                        className="absolute top-0 left-0 w-full h-[60vh]"
                        style={{
                            background:
                                "radial-gradient(at 0% 0%, color-mix(in oklab, var(--accent) 35%, transparent) 0, transparent 55%), radial-gradient(at 100% 0%, color-mix(in oklab, var(--aksen-2) 22%, transparent) 0, transparent 50%)",
                        }}
                    />
                </div>

                {/* Navbar */}
                <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary  flex items-center justify-center shadow-lg shadow-primary/30">
                          
    <img
        src={LogoImage}
        alt="Logo"
        className="h-12 w-12 object-contain"
    /> 
                        </div>
                                <div>
                                    <h1 className="text-lg font-bold tracking-tight leading-none">SIPERTANI</h1>
                                    <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Sistem Informasi Prediksi Pertanian</p>
                                </div>
                            </div>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-lg shadow-primary/15"
                            >
                                Masuk
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div className="space-y-6 sm:space-y-8">
                           
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-[var(--font-display)] leading-[1.1]">
                                Prediksi Panen Jagung
                                <span className="block text-primary">Lebih Akurat &amp; Cepat</span>
                            </h1>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                                SIPERTANI membantu petani dan pengelola lahan mengoptimalkan produksi jagung melalui prediksi berbasis cuaca, data historis, dan rekomendasi agronomi yang praktis.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:translate-y-[-1px] shadow-xl shadow-primary/20"
                                >
                                    Mulai Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="#fitur"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                                >
                                    Pelajari Fitur
                                </a>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-primary" /> Data cuaca real-time
                                </span>
                                {/* <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-primary" /> Prediksi produksi 7 hari
                                </span> */}
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-primary" /> Rekomendasi otomatis
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-accent/20 to-aksen-2/20 blur-2xl" />
                            <div className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl shadow-primary/10">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimasi Produksi</p>
                                        {/* <p className="text-2xl sm:text-3xl font-bold mt-1">20 <span className="text-base font-medium text-muted-foreground">ton</span></p> */}
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="h-40 sm:h-48 rounded-2xl bg-muted/50 flex items-end justify-between gap-2 px-4 pb-4 overflow-hidden">
                                    {[35, 52, 48, 70, 65, 88, 92].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <div className="rounded-2xl bg-accent/30 border border-border p-3 text-center">
                                        <CloudSun className="h-5 w-5 mx-auto text-primary" />
                                        <p className="mt-2 text-xs font-semibold">Cuaca</p>
                                       
                                    </div>
                                    <div className="rounded-2xl bg-[var(--color-langit)]/15 border border-border p-3 text-center">
                                        <MapPin className="h-5 w-5 mx-auto" style={{ color: "var(--color-tanah)" }} />
                                        <p className="mt-2 text-xs font-semibold">Lahan</p>
                                        
                                    </div>
                                    <div className="rounded-2xl bg-[var(--color-aksen-2)]/15 border border-border p-3 text-center">
                                        <BarChart3 className="h-5 w-5 mx-auto" style={{ color: "var(--color-tanah)" }} />
                                        <p className="mt-2 text-xs font-semibold">Akurasi</p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fitur */}
                <section id="fitur" className="w-full bg-card/60 border-y border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[var(--font-display)]">
                                Semua yang Petani Butuhkan
                            </h2>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                                Dashboard lengkap dengan data historis, prakiraan cuaca, dan saran pertanian yang mudah dipahami.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="rounded-3xl border border-border bg-background p-6 hover:border-primary/30 transition-colors">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-base font-bold">Prediksi Produksi</h3>
                                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Estimasi hasil panen jagung berdasarkan tren historis dan kondisi lahan terkini.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-border bg-background p-6 hover:border-primary/30 transition-colors">
                                <div className="h-12 w-12 rounded-2xl bg-[var(--color-langit)]/15 flex items-center justify-center mb-4">
                                    <CloudSun className="h-6 w-6" style={{ color: "var(--color-langit)" }} />
                                </div>
                                <h3 className="text-base font-bold">Prakiraan Cuaca</h3>
                                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Informasi cuaca 7 hari ke depan untuk perencanaan aktivitas pertanian yang lebih baik.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-border bg-background p-6 hover:border-primary/30 transition-colors">
                                <div className="h-12 w-12 rounded-2xl bg-[var(--color-aksen-2)]/15 flex items-center justify-center mb-4">
                                    <BarChart3 className="h-6 w-6" style={{ color: "var(--color-tanah)" }} />
                                </div>
                                <h3 className="text-base font-bold">Data Historis</h3>
                                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Lihat riwayat produksi dan cuaca masa lalu sebagai dasar pengambilan keputusan.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-border bg-background p-6 hover:border-primary/30 transition-colors">
                                <div className="h-12 w-12 rounded-2xl bg-accent/40 flex items-center justify-center mb-4">
                                    <Smartphone className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-base font-bold">Akses Mobile</h3>
                                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Pantau lahan dari ponsel kapan saja dengan tampilan yang responsif dan ringan.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Keunggulan */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-primary/5">
                                <div className="space-y-4">
                                    {[
                                        { label: "Integrasi data satelit & sensor tanah", ok: true },
                                        { label: "Rekomendasi pemupukan & irigasi otomatis", ok: true },
                                        { label: "Laporan produksi siap cetak", ok: true },
                                        { label: "Peringatan dini cuaca ekstrem", ok: true },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="h-4 w-4 text-primary" />
                                            </div>
                                            <p className="text-sm font-medium">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-5">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[var(--font-display)]">
                                Keputusan Pertanian Berbasis Data
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Tidak perlu menebak-nebak lagi. SIPERTANI mengubah data cuaca, kondisi tanah, dan riwayat panen menjadi rekomendasi konkret yang meningkatkan hasil dan mengurangi risiko gagal panen.
                            </p>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-lg shadow-primary/20"
                            >
                                Masuk ke Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
                    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-[oklch(0.28_0.08_150)] text-primary-foreground px-6 sm:px-12 py-12 sm:py-16 overflow-hidden text-center">
                        <div
                            className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-20"
                            style={{ backgroundColor: "var(--color-aksen-2)" }}
                        />
                        <div
                            className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-20"
                            style={{ backgroundColor: "var(--color-accent)" }}
                        />
                        <div className="relative max-w-2xl mx-auto space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[var(--font-display)]">
                                Siap Meningkatkan Produksi Jagung?
                            </h2>
                            <p className="text-sm sm:text-base opacity-90">
                                Akses dashboard prediksi, cuaca, dan rekomendasi pertanian dalam satu platform.
                            </p>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
                            >
                                Masuk ke SIPERTANI
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full border-t border-border bg-card/50 mt-auto">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary  flex items-center justify-center shadow-lg shadow-primary/30">
                          
    <img
        src={LogoImage}
        alt="Logo"
        className="h-12 w-12 object-contain"
    /> 
                        </div>
                                <div>
                                    <p className="font-semibold text-foreground">SIPERTANI</p>
                                    <p>Sistem Informasi Prediksi Pertanian</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>v2.4.1-stable</span>
                                <span className="text-muted-foreground/60">|</span>
                                <span>Laravel v{laravelVersion} (PHP v{phpVersion})</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}