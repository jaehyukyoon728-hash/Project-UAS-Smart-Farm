<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sensors')->insert([
            [
                'crop_id'=>1,
                'tahap_pertumbuhan'=>'Pemanenan',
                'moi'=>45,
                'tempt'=>29,
                'kelembaban_udara'=>72,
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            [
                'crop_id'=>2,
                'tahap_pertumbuhan'=>'Pembentukan Buah',
                'moi'=>52,
                'tempt'=>27,
                'kelembaban_udara'=>78,
                'created_at'=>now(),
                'updated_at'=>now(),
            ],

            ]);
    }
}
