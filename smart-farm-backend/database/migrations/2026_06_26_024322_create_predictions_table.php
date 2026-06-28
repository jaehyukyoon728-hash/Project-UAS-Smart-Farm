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

            $table->foreignId('sensor_id')
                ->constrained('sensors')
                ->cascadeOnDelete();

            $table->foreignId('admin_id')
                ->constrained('admins')
                ->cascadeOnDelete();

            $table->date('tanggal_pencatatan');

            $table->string('status_kondisi');

            $table->text('rekomendasi');

            $table->json('rf')->nullable();

            $table->json('kmeans')->nullable();

            $table->timestamps();
        });
        // Schema::create('predictions', function (Blueprint $table) {
        //     $table->id();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
