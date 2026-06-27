<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PredictionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('predictions')->insert([
            [
                'sensor_id'=>1,
                'admin_id'=>1,
                'tanggal_pencatatan'=>now(),
                'status_kondisi'=>'Tidak Pelru Irigasi',
                'rekomendasi'=>'Pertahankan pola penyiraman.',
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            [
                'sensor_id'=>2,
                'admin_id'=>1,
                'tanggal_pencatatan'=>now(),
                'status_kondisi'=>'Perlu Irigasi',
                'rekomendasi'=>'Tambahkan penyiraman dan lakukan pemupukan.',
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            ]);
    }
}
