<?php

namespace Database\Seeders;

use App\Models\Waktu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WaktuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jamPelajaran = [
            ['07:00:00', '07:45:00'],
            ['07:45:00', '08:30:00'],
            ['08:30:00', '09:15:00'],
            ['09:15:00', '10:00:00'],
            ['10:00:00', '10:45:00'],
            ['10:45:00', '11:30:00'],
            ['11:30:00', '12:15:00'], // sebelum istirahat
            ['13:00:00', '13:45:00'], // setelah istirahat
            ['13:45:00', '14:30:00'],
            ['14:30:00', '15:15:00'],
        ];

        foreach ($jamPelajaran as [$mulai, $selesai]) {
            Waktu::create([
                'jam_mulai' => $mulai,
                'jam_selesai' => $selesai
            ]);
        }
    }
}
