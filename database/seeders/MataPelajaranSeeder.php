<?php

namespace Database\Seeders;

use App\Models\MataPelajaran;
use Illuminate\Database\Seeder;

class MataPelajaranSeeder extends Seeder
{
    public function run(): void
    {
        $mataPelajaran = [
            'Pendidikan Agama',
            'Pendidikan Kewarganegaraan',
            'Bahasa Indonesia',
            'Matematika',
            'Bahasa Inggris',
            'Sejarah Indonesia',
            'Seni Budaya',
            'Pendidikan Jasmani dan Olahraga',
            'Simulasi dan Komunikasi Digital',
            'Fisika',
            'Kimia',
            'Pemrograman Dasar',
            'Komputer dan Jaringan Dasar',
            'Sistem Operasi',
            'Basis Data',
            'Pemrograman Web'
        ];

        foreach ($mataPelajaran as $mapel) {
            MataPelajaran::create(['nama_pelajaran' => $mapel]);
        }
    }
}
