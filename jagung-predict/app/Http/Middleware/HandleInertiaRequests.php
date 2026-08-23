<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'berhasil' => fn () => $request->session()->get('berhasil'),
                'estimasi_ton' => fn () => $request->session()->get('estimasi_ton'),
                'margin_error' => fn () => $request->session()->get('margin_error'),
                'rentang_bawah' => fn () =>  $request->session()->get('rentang_bawah'),
                'rentang_atas' => fn () => $request->session()->get('rentang_atas'),
                'prediksi_error' => fn() => session('prediksi_error'),
            ],
        ];
    }
}
