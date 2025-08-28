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
                'jenis_pelanggaran_id' => 2, // contoh: 2 = Ringan
                'nama_foto' => null,
                'deskripsi' => 'Terlambat masuk sekolah 30 menit',
                'status' => 'pengajuan',
                'pelapor' => 1, // pastikan user ID 1 ada
                'terlapor' => 1, // pastikan siswa ID 1 ada
            ],
            [
                'nama_pelanggaran' => 'Tidak Berseragam Lengkap',
                'jenis_pelanggaran_id' => 2, // contoh: 2 = Ringan
                'nama_foto' => null,
                'deskripsi' => 'Tidak memakai dasi',
                'status' => 'ditolak',
                'pelapor' => 1,
                'terlapor' => 2,
            ],
            [
                'nama_pelanggaran' => 'Membolos',
                'jenis_pelanggaran_id' => 1, // contoh: 1 = Berat
                'nama_foto' => null,
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
