<?php

namespace Database\Seeders;

use App\Models\Jadwal;
use App\Models\Pertemuan;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PertemuanSeeder extends Seeder
{
    public function run(): void
    {
        // Get all schedules
        $jadwals = Jadwal::all();

        foreach ($jadwals as $jadwal) {
            $tanggal = Carbon::now()->startOfWeek();

            // Add 16 meetings for each schedule
            for ($i = 1; $i <= 16; $i++) {
                // Determine meeting name
                $nama_pertemuan = match($i) {
                    8 => 'UTS',
                    16 => 'UAS',
                    default => 'Pertemuan ' . $i
                };

                // Create the meeting
                Pertemuan::create([
                    'nama_pertemuan' => $nama_pertemuan,
                    'id_jadwal' => $jadwal->id,
                    'tanggal' => $tanggal->copy()->addWeeks($i - 1)
                ]);
            }
        }
    }
}
