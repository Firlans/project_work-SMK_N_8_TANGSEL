<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemesterSeeder extends Seeder
{
    public function run(): void
    {
        $semesters = [
            ['nama_semester' => 'Semester 1 (Ganjil)', 'status' => 'Tidak Aktif'],
            ['nama_semester' => 'Semester 2 (Genap)', 'status' => 'Tidak Aktif'],
            ['nama_semester' => 'Semester 3 (Ganjil)', 'status' => 'Tidak Aktif'],
            ['nama_semester' => 'Semester 4 (Genap)', 'status' => 'Tidak Aktif'],
            ['nama_semester' => 'Semester 5 (Ganjil)', 'status' => 'Tidak Aktif'],
            ['nama_semester' => 'Semester 6 (Genap)', 'status' => 'Aktif'],
        ];

        foreach ($semesters as $semester) {
            DB::table('semester')->insert([
                'nama_semester' => $semester['nama_semester'],
                'status' => $semester['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
