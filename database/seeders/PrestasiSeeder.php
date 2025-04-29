<?php

namespace Database\Seeders;

use App\Models\Prestasi;
use Illuminate\Database\Seeder;

class PrestasiSeeder extends Seeder
{
    public function run(): void
    {
        $prestasi = [
            [
                'nama_prestasi' => 'Juara 1 Lomba Matematika',
                'nama_foto' => null,
                'deskripsi' => 'Prestasi dalam lomba matematika tingkat provinsi',
                'status' => 'pengajuan',
                'siswa_id' => 1,
            ],
            [
                'nama_prestasi' => 'Juara 2 Olimpiade Sains',
                'nama_foto' => null,
                'deskripsi' => 'Prestasi dalam olimpiade sains tingkat kota',
                'status' => 'ditolak',
                'siswa_id' => 2,
            ],
            [
                'nama_prestasi' => 'Juara 1 Lomba Programming',
                'nama_foto' => null,
                'deskripsi' => 'Prestasi dalam lomba programming tingkat nasional',
                'status' => 'disetujui',
                'siswa_id' => 3,
            ],
        ];

        foreach ($prestasi as $data) {
            Prestasi::create($data);
        }
    }
}
