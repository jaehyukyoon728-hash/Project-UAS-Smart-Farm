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
        Schema::create('crops', function (Blueprint $table) {

            $table->id();

            $table->foreignId('land_id')
                ->constrained('lands')
                ->cascadeOnDelete();

            $table->enum('nama', ['Gandum', 'Cabai', 'Wortel', 'Kentang', 'Tomat']);

            $table->enum('jenis_tanah', ['Tanah Liat', 'Tanah Pasir', 'Tanah Merah', 'Tanah Lempung', 'Tanah Hitam', 'Tanah Aluvial', 'Tanah Pesisir']);

            $table->timestamps();
        });
        // Schema::create('crops', function (Blueprint $table) {
        //     $table->id();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crops');
    }
};
