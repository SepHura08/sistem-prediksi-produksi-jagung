<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class weather_logs extends Model
{
    protected $fillable = [
        'date',
        'temperature',
        'rainfall',
        'humidity',
        'source',
    ];
}
