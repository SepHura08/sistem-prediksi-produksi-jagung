<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PrediksiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WeatherController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'tampilkan'])
            ->middleware(['auth', 'verified'])
            ->name('dashboard');
// Prediksi
    Route::get('/prediksi', [PrediksiController::class, 'tampilkan'])
        ->name('prediksi');
    Route::post('/prediksi', [PrediksiController::class, 'proses'])
        ->name('prediksi.proses');

    // Input hasil panen aktual
    Route::post('/prediksi/{id}/aktual', [PrediksiController::class, 'simpanAktual'])
        ->name('prediksi.aktual');

    Route::delete('/predictions/{predictions}', [PrediksiController::class, 'destroy'])
        ->name('predictions.destroy');

    // Data historis
    Route::get('/historis', [PrediksiController::class, 'historis'])
        ->name('historis');
    Route::get('/historis/ekspor', [PrediksiController::class, 'eksporCSV'])
        ->name('historis.ekspor');

    // Cuaca (dipanggil otomatis saat dashboard buka)
    Route::get('/api/cuaca', [WeatherController::class, 'terkini'])
        ->name('cuaca.terkini');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
