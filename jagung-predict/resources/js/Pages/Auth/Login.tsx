// resources/js/Pages/Auth/Login.tsx

import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import {  User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import LogoImage from '@/Lovable/assets/logo7.png'

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [tampilkanSandi, setTampilkanSandi] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

           
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "radial-gradient(var(--primary) 1px, transparent 1px)",
                        backgroundSize: "24px 24px"
                    }}
                />
                <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl shadow-primary/10 border border-border p-8 sm:p-10">
                    <div className="flex flex-col items-center">
                        
                        <div className="h-16 w-16 rounded-full bg-primary  flex items-center justify-center shadow-lg shadow-primary/30">
                          
    <img
        src={LogoImage}
        alt="Logo"
        className="h-12 w-12 object-contain"
    /> 
                        </div>
                        <h1 className="mt-5 text-2xl font-bold popins">Login SIPERTANI</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Sistem Prediksi Produksi Jagung
                        </p>
                    </div>

                    {status && (
                        <div className="mt-4 text-sm font-medium text-primary text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold tracking-wide mb-2">
                                EMAIL
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan email Anda"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold tracking-wide">
                                    PASSWORD
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-semibold text-primary hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={tampilkanSandi ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setTampilkanSandi(!tampilkanSandi)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {tampilkanSandi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember */}
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', (e.target.checked || false) as false)
                                }
                            />
                            <span className="text-muted-foreground">
                                Ingat saya di perangkat ini
                            </span>
                        </label>

                        <button
                            
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
                        >
                            {processing ? "Memproses..." : "Masuk"}
                            <LogIn className="h-4 w-4" />
                        </button>

                        <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="font-semibold text-primary hover:underline">
                                Daftar
                            </Link>{' '}
                            Akun
                        </div>
                    </form>
                </div>
            
        </GuestLayout>
    );
}