<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('activities')->insert([
            [
                'admin_id' => 1,
                'user_id' => 1,
                'land_id' => 1,
                'prediction_id' => 1,
                'activity_type' => 'Penyiraman',
                'description' => 'Melakukan penyiraman rutin pada Lahan Cabai.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'admin_id' => 1,
                'user_id' => 2,
                'land_id' => 2,
                'prediction_id' => 2,
                'activity_type' => 'Pemupukan',
                'description' => 'Melakukan pemupukan tambahan pada Lahan Tomat sesuai rekomendasi.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
