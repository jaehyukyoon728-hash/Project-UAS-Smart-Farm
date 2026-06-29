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
        Schema::create('sensors', function (Blueprint $table) {

            $table->id();

            $table->foreignId('crop_id')
                ->constrained('crops')
                ->cascadeOnDelete();

            $table->enum('tahap_pertumbuhan', ['Perkecambahan', 'Tahap Bibit', 'Umbi', 'Pembungaan', 'Penyerbukan', 'Pembentukan Buah', 'Pematangan Buah', 'Pemanenan']);

            $table->decimal('moi',5,2);

            $table->decimal('tempt',5,2);

            $table->decimal('kelembaban_udara',5,2);

            $table->timestamps();
        });
        // Schema::create('sensors', function (Blueprint $table) {
        //     $table->id();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensors');
    }
};
