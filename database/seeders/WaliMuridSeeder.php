<?php

namespace Database\Seeders;

use App\Models\Siswa;
use App\Models\WaliMurid;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WaliMuridSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = ['ayah', 'ibu', 'wali murid'];

        $siswa = Siswa::all();

        foreach($siswa as $s) {
            WaliMurid::create([
                'id_siswa' => $s->id,
                'nama_lengkap' => fake()->name(),
                'no_telp' => fake()->phoneNumber(),
                'email' => fake()->unique()->safeEmail(),
                'status' => fake()->randomElement($statuses),
                'alamat' => fake()->address()
            ]);
        }
    }
}
