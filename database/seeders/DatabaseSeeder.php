<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            KelasSeeder::class,
            MataPelajaranSeeder::class,
            HariSeeder::class,
            UserSeeder::class,
            GuruSeeder::class,
            SemesterSeeder::class,
            SiswaSeeder::class,
            WaliMuridSeeder::class,
            KehadiranSeeder::class,
            JadwalSeeder::class, // Add this line
        ]);
    }
}
