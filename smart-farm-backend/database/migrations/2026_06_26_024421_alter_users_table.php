<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {

    // }
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->foreignId('admin_id')
                ->nullable()
                ->constrained('admins')
                ->cascadeOnDelete();

            $table->string('nama')->after('id');

            $table->string('nim')->unique()->after('email');

            $table->string('no_phone')->after('nim');

            $table->string('lokasi')->nullable()->after('no_phone');

            $table->enum('status', ['aktif', 'tidak aktif'])->default('aktif')->after('no_phone');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
