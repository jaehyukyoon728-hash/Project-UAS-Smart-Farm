<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admins')->insert([
            [
                'nama' => 'Atminn',
                'email' => 'admin@gmail.com',
                'no_phone' => '081234567890',
                'password' => Hash::make('123abc'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}