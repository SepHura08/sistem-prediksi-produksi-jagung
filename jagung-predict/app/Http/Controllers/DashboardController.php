<?php

namespace App\Http\Controllers;

use App\Models\predictions;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
     public function __construct(
        private WeatherService $cuaca
    ) {}

// mengambil data cuaca
    public function tampilkan()
   {
    $dataCuaca = $this->cuaca->ambilCuacaTerkini();

    //mengambil data prediksi pengguna
    $prediksiTerakhir = predictions::where('user_id', auth()->id())
        ->whereNotNull('actual_ton')
        ->whereNotNull('harvest_year')
        ->latest()
        ->get(['id','land_area','estimated_ton','actual_ton','harvest_year','created_at']);

        // Hitung total
    $totalEstimasi = predictions::where('user_id', auth()->id())
        ->sum('estimated_ton');
        
    $totalLuasLahan = predictions::where('user_id', auth()->id())
        ->sum('land_area');

//menampilkan di dashboard:
    return Inertia::render('Dashboard', [
        'cuaca'            => $dataCuaca,
        'prediksiTerakhir' => $prediksiTerakhir,
        'totalEstimasi'    => $totalEstimasi,
        'totalLuasLahan'   => $totalLuasLahan,
    ]);

}
}
