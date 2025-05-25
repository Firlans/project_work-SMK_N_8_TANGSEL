<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Hari;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Waktu;
use App\Models\Jadwal;
use Illuminate\Database\Seeder;

class JadwalSeeder extends Seeder
{
    public function run(): void
    {
        $kelasList = Kelas::all();
        $guruList = Guru::all();
        $hariList = Hari::all();
        $waktuList = Waktu::all();
        $mapelList = MataPelajaran::all();

        if ($kelasList->isEmpty() || $guruList->isEmpty() || $hariList->isEmpty() || $waktuList->isEmpty() || $mapelList->isEmpty()) {
            $this->command->warn("Data kelas, guru, hari, mapel,atau waktu masih kosong.");
            return;
        }

        $count = 0;

        while ($count < 20) {
            $kelas = $kelasList->random();
            $guru = $guruList->random();
            $hari = $hariList->random();
            $waktu = $waktuList->random();
            $mapel = $mapelList->random();

            // Cek jika kombinasi sudah ada
            $exists = Jadwal::where('id_kelas', $kelas->id)
                ->where('id_guru', $guru->id)
                ->where('id_hari', $hari->id)
                ->where('id_waktu', $waktu->id)
                ->where('id_mata_pelajaran', $waktu->id)
                ->exists();

            if (!$exists) {
                Jadwal::create([
                    'id_kelas' => $kelas->id,
                    'id_guru' => $guru->id,
                    'id_hari' => $hari->id,
                    'id_waktu' => $waktu->id,
                    'id_mata_pelajaran' => $mapel->id,
                ]);

                $count++;
            }
        }

        $this->command->info("Berhasil membuat $count data jadwal.");
    }
}
