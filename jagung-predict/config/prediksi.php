<?php

return [
    'flask_api_url' => env('FLASK_API_URL', 'http://localhost:5000'),

    'cuaca_default' => [
        'curah_hujan' => (float) env('CUACA_DEFAULT_CURAH_HUJAN', 2837.84),
        'suhu'        => (float) env('CUACA_DEFAULT_SUHU',        27.58),
        'kelembapan'  => (float) env('CUACA_DEFAULT_KELEMBAPAN',  79.45),
    ],

    'model' => [
        'mae'  => 26.58,
        'r2'   => 0.948,
    ],
];