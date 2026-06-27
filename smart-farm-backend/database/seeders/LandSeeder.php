<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lands')->insert([
            [
                'user_id'=>1,
                'admin_id'=>1,
                'nama'=>'Lahan Cabai',
                'lokasi'=>'Lab 1',
                'luas_lahan'=>250,
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            [
                'user_id'=>2,
                'admin_id'=>1,
                'nama'=>'Lahan Tomat',
                'lokasi'=>'Lab 2',
                'luas_lahan'=>500,
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            ]);
    }
}
