<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Kehadiran;
use App\Models\Siswa;
use Illuminate\Database\Seeder;

class KehadiranSeeder extends Seeder
{
    public function run(): void
    {
        $siswa = Siswa::all();
        $guru = Guru::all();

        foreach($siswa as $student) {
            for($i = 0; $i < 10; $i++) {
                Kehadiran::create([
                    'id_siswa' => $student->id,
                    'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                    'status' => fake()->randomElement(['Hadir', 'Izin', 'Sakit', 'Alfa']),
                    'guru_id' => $guru->random()->id,
                    'jam' => fake()->time(),
                    'keterangan' => fake()->optional()->sentence()
                ]);
            }
        }
    }
}
