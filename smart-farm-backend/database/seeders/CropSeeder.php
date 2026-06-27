<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CropSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('crops')->insert([
            [
                'land_id'=>1,
                'nama'=>'Cabai',
                'jenis_tanah'=>'Tanah Liat',
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            [
                'land_id'=>2,
                'nama'=>'Tomat',
                'jenis_tanah'=>'Tanah Lempung',
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            ]);
    }
}
