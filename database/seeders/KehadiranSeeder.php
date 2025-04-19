<?php

namespace Database\Seeders;

use App\Models\Kehadiran;
use App\Models\Siswa;
use App\Models\Jadwal;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class KehadiranSeeder extends Seeder
{
    public function run(): void
    {
        $siswaList = Siswa::all();
        $jadwalList = Jadwal::all();
        $statusKehadiran = ['Hadir', 'Izin', 'Sakit', 'Alfa'];

        $today = Carbon::now();
        $startDate = $today->copy()->startOfMonth();
        $endDate = $today->copy()->endOfMonth();

        for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }

            $dayOfWeek = $date->dayOfWeek;
            // Convert Sunday (0) to 7, Monday (1) stays 1, etc.
            $dayOfWeek = $dayOfWeek === 0 ? 7 : 1;

            // Get jadwals for current day
            $todayJadwals = $jadwalList->where('id_hari', $dayOfWeek);

            foreach ($todayJadwals as $jadwal) {
                $classStudents = $siswaList->where('id_kelas', $jadwal->id_kelas);

                foreach ($classStudents as $siswa) {
                    Kehadiran::create([
                        'id_siswa' => $siswa->id,
                        'id_jadwal' => $jadwal->id,
                        'tanggal' => $date->format('Y-m-d'),
                        'status' => $statusKehadiran[array_rand($statusKehadiran)],
                        'keterangan' => fake()->optional(0.3)->sentence(),
                        'created_at' => $date,
                        'updated_at' => $date
                    ]);
                }
            }
        }
    }
}