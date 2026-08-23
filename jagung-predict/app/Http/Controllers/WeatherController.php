<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function __construct(
        private WeatherService $cuaca
    ) {}

    // GET /api/cuaca
    // Dipanggil dari React saat dashboard dibuka
    public function terkini(): JsonResponse
    {
        $data = $this->cuaca->ambilCuacaTerkini();
        return response()->json($data);
    }
}
