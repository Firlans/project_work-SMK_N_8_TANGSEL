<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisPelanggaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('jenis_pelanggaran')->insert([
            [
                'nama_jenis' => 'Berat',
                'poin' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_jenis' => 'Ringan',
                'poin' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
