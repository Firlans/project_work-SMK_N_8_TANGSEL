<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil seeder untuk Kelas terlebih dahulu
        $this->call(KelasSeeder::class);

        // Setelah Kelas terisi, baru tambahkan data Siswa
        $this->call(SiswaSeeder::class);
    }
}
