<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DevelopmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $this->call([
            KelasSeeder::class,
            MataPelajaranSeeder::class,
            WaktuSeeder::class,
            HariSeeder::class,
            UserSeeder::class,
            GuruSeeder::class,
            SiswaSeeder::class,
            WaliMuridSeeder::class,
            JadwalSeeder::class,
            PertemuanSeeder::class,
            KehadiranSeeder::class,
            JenisPelanggaranSeeder::class,
            PrestasiSeeder::class,
            PelanggaranSeeder::class,
        ]);
    }
}
