<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            KelasSeeder::class,
            MataPelajaranSeeder::class, // Add this line
            GuruSeeder::class,
            SemesterSeeder::class,
            SiswaSeeder::class,
            WaliMuridSeeder::class,
        ]);
    }
}
