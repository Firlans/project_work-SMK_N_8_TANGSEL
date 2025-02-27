<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            KelasSeeder::class,
            GuruSeeder::class,  // Guru perlu dibuat sebelum siswa
            SiswaSeeder::class,
        ]);
    }
}
