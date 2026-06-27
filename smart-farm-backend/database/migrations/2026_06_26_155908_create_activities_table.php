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
        Schema::create('activities', function (Blueprint $table) {

            $table->id();

            $table->foreignId('admin_id')
                ->nullable()
                ->constrained('admins')
                ->nullOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('land_id')
                ->nullable()
                ->constrained('lands')
                ->nullOnDelete();

            $table->foreignId('prediction_id')
                ->nullable()
                ->constrained('predictions')
                ->nullOnDelete();

            $table->string('activity_type');

            $table->text('description');

            $table->timestamps();
        });
    }
    // public function up(): void
    // {
    //     Schema::create('activities', function (Blueprint $table) {
    //         $table->id();
    //         $table->timestamps();
    //     });
    // }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
