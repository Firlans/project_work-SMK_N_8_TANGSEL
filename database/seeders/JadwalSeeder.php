<?php

namespace Database\Seeders;

use App\Models\Jadwal;
use Illuminate\Database\Seeder;

class JadwalSeeder extends Seeder
{
    public function run(): void
    {
        // Example for 2 classes (Kelas X-1 and X-2) for Monday and Tuesday
        $jadwals = [
            // MONDAY - Kelas X-1
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 1, // Matematika
                'id_hari' => 1, // Senin
                'jam_mulai' => '07:00:00',
                'jam_selesai' => '08:30:00',
            ],
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 2, // B.Indonesia
                'id_hari' => 1,
                'jam_mulai' => '08:30:00',
                'jam_selesai' => '09:30:00',
            ],
            // First Break 09:30 - 10:00
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 3, // B.Inggris
                'id_hari' => 1,
                'jam_mulai' => '10:00:00',
                'jam_selesai' => '11:00:00',
            ],
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 4, // IPA
                'id_hari' => 1,
                'jam_mulai' => '11:00:00',
                'jam_selesai' => '12:00:00',
            ],
            // Lunch Break 12:00 - 13:00
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 5, // IPS
                'id_hari' => 1,
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '14:15:00',
            ],
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 6, // Seni Budaya
                'id_hari' => 1,
                'jam_mulai' => '14:15:00',
                'jam_selesai' => '15:30:00',
            ],

            // MONDAY - Kelas X-2
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 3, // B.Inggris
                'id_hari' => 1,
                'jam_mulai' => '07:00:00',
                'jam_selesai' => '08:30:00',
            ],
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 1, // Matematika
                'id_hari' => 1,
                'jam_mulai' => '08:30:00',
                'jam_selesai' => '09:30:00',
            ],
            // First Break 09:30 - 10:00
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 2, // B.Indonesia
                'id_hari' => 1,
                'jam_mulai' => '10:00:00',
                'jam_selesai' => '11:00:00',
            ],
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 5, // IPS
                'id_hari' => 1,
                'jam_mulai' => '11:00:00',
                'jam_selesai' => '12:00:00',
            ],
            // Lunch Break 12:00 - 13:00
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 4, // IPA
                'id_hari' => 1,
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '14:15:00',
            ],
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 7, // Penjas
                'id_hari' => 1,
                'jam_mulai' => '14:15:00',
                'jam_selesai' => '15:30:00',
            ],

            // TUESDAY - Kelas X-1 (Different subject arrangement)
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 7, // Penjas
                'id_hari' => 2,
                'jam_mulai' => '07:00:00',
                'jam_selesai' => '08:30:00',
            ],
            [
                'id_kelas' => 1,
                'id_mata_pelajaran' => 4, // IPA
                'id_hari' => 2,
                'jam_mulai' => '08:30:00',
                'jam_selesai' => '09:30:00',
            ],
            // Add more entries for Wednesday (id_hari: 3), Thursday (id_hari: 4), and Friday (id_hari: 5)
            // Following similar pattern but with different subject arrangements

            // TUESDAY - Kelas X-2
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 6, // Seni Budaya
                'id_hari' => 2,
                'jam_mulai' => '07:00:00',
                'jam_selesai' => '08:30:00',
            ],
            [
                'id_kelas' => 2,
                'id_mata_pelajaran' => 5, // IPS
                'id_hari' => 2,
                'jam_mulai' => '08:30:00',
                'jam_selesai' => '09:30:00',
            ],
            // Add more entries for Wednesday (id_hari: 3), Thursday (id_hari: 4), and Friday (id_hari: 5)
            // Following similar pattern but with different subject arrangements
        ];

        foreach ($jadwals as $jadwal) {
            Jadwal::create($jadwal);
        }
    }
}
