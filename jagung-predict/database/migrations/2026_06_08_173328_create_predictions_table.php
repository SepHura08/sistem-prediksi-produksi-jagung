<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
             $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('weather_logs_id')
                ->nullable()
                ->constrained('weather_logs')
                ->nullOnDelete();
            $table->decimal('land_area', 10, 2);
            $table->decimal('estimated_ton', 10, 2);
            $table->decimal('actual_ton', 10, 2)
                ->nullable();
            $table->year('harvest_year')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
