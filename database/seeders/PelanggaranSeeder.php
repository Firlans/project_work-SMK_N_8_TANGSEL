<?php

namespace Database\Seeders;

use App\Models\Pelanggaran;
use Illuminate\Database\Seeder;

class PelanggaranSeeder extends Seeder
{
    public function run(): void
    {
        $pelanggaran = [
            [
                'nama_pelanggaran' => 'Terlambat',
                'deskripsi' => 'Terlambat masuk sekolah 30 menit',
                'status' => 'pengajuan',
                'pelapor' => 1, // Make sure this user ID exists
                'terlapor' => 1, // Make sure this siswa ID exists
            ],
            [
                'nama_pelanggaran' => 'Tidak Berseragam Lengkap',
                'deskripsi' => 'Tidak memakai dasi',
                'status' => 'ditolak',
                'pelapor' => 1,
                'terlapor' => 2,
            ],
            [
                'nama_pelanggaran' => 'Membolos',
                'deskripsi' => 'Tidak mengikuti pelajaran jam ke 3-4',
                'status' => 'proses',
                'pelapor' => 1,
                'terlapor' => 3,
            ],
        ];

        foreach ($pelanggaran as $data) {
            Pelanggaran::create($data);
        }
    }
}
