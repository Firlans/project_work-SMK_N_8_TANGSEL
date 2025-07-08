<?php

namespace Database\Seeders;

use App\Models\Kehadiran;
use App\Models\Siswa;
use App\Models\Pertemuan;
use Illuminate\Database\Seeder;

class KehadiranSeeder extends Seeder
{
    public function run(): void
    {
        $pertemuans = Pertemuan::with('jadwal')->get();
        $statusKehadiran = ['Hadir', 'Izin', 'Sakit', 'Alfa', "Ojt", "Ijt"];

        foreach ($pertemuans as $pertemuan) {
            // Get the class ID from the related schedule
            $kelasId = $pertemuan->jadwal->id_kelas;

            // Get all students in this class
            $siswaList = Siswa::where('id_kelas', $kelasId)->get();

            foreach ($siswaList as $siswa) {
                // Create attendance record for each student
                Kehadiran::create([
                    'id_siswa' => $siswa->id,
                    'id_pertemuan' => $pertemuan->id,
                    'status' => $statusKehadiran[array_rand($statusKehadiran)],
                    'keterangan' => fake()->optional(0.3)->sentence(),
                    'created_at' => $pertemuan->tanggal,
                    'updated_at' => $pertemuan->tanggal,
                ]);
            }
        }
    }
}
