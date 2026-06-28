<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'admin_id' => 1,
                'nama' => 'Meisya',
                'email' => 'meisya@gmail.com',
                'nim' => '22010001',
                'no_phone' => '081111111111',
                'lokasi' => 'Bandung',
                'password' => Hash::make('123abc'),
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
            'admin_id' => 1,
            'nama' => 'Budi',
            'email' => 'budi@gmail.com',
            'nim' => '22010002',
            'no_phone' => '082222222222',
            'lokasi' => 'Cirebon',
            'password' => Hash::make('123abc'),
            'status' => 'tidak aktif',
            'created_at' => now(),
            'updated_at' => now(),
            ],
        ]);
    }
}