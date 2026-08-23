<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class predictions extends Model
{
     protected $table = 'predictions';
     
     protected $fillable = [
        'user_id',
        'weather_logs_id',
        'land_area',
        'estimated_ton',
        'actual_ton',
        'harvest_year',
    ];
    protected $casts = [
        'land_area' => 'float',
        'estimated_ton' => 'float',
        'actual_ton' => 'float'
    ];
    // Satu pengguna dapat memiliki banyak data prediksi,
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
