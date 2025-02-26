<?php

namespace Database\Seeders;

use App\Models\Siswa;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        // Create 50 random students
        Siswa::factory()->count(50)->create();

        // Create some specific students
        Siswa::factory()->create([
            'nama_lengkap' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => bcrypt('password123'),
            'jenis_kelamin' => 'L',
            'tanggal_lahir' => '2006-01-01',
            'alamat' => 'Jl. Contoh No. 123',
            'no_telp' => '081234567890',
            'nisn' => '1234567890',
            'nis' => '123456',
            'id_kelas' => 1,
        ]);

        Siswa::factory()->create([
            'nama_lengkap' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'password' => bcrypt('password123'),
            'jenis_kelamin' => 'P',
            'tanggal_lahir' => '2006-02-01',
            'alamat' => 'Jl. Contoh No. 124',
            'no_telp' => '081234567891',
            'nisn' => '1234567891',
            'nis' => '123457',
            'id_kelas' => 1,
        ]);
    }
}
