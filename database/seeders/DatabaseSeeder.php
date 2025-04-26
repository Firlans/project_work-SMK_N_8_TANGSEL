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
            SiswaSeeder::class,
            WaliMuridSeeder::class,
            JadwalSeeder::class,
            KehadiranSeeder::class,
            PrestasiSeeder::class,
            PelanggaranSeeder::class,
        ]);
    }
}
