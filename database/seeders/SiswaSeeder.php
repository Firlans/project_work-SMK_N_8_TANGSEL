<?php

namespace Database\Seeders;

use App\Models\Siswa;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Kelas;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        // Buat 50 siswa secara otomatis dengan factory
        Siswa::factory(50)->create();

        // Buat siswa spesifik
        $this->createSpecificSiswa([
            'nama_lengkap' => 'John Doe',
            'jenis_kelamin' => 'L',
            'tanggal_lahir' => '2006-01-01',
            'alamat' => 'Jl. Contoh No. 123',
            'no_telp' => '081234567890',
            'nisn' => '1234567890',
            'nis' => '123456',
        ]);

        $this->createSpecificSiswa([
            'nama_lengkap' => 'Jane Doe',
            'jenis_kelamin' => 'P',
            'tanggal_lahir' => '2006-02-01',
            'alamat' => 'Jl. Contoh No. 124',
            'no_telp' => '081234567891',
            'nisn' => '1234567891',
            'nis' => '123457',
        ]);
    }

    private function createSpecificSiswa(array $data)
    {
        // Buat user baru untuk siswa dengan email otomatis
        $user = User::factory()->create([
            'name' => $data['nama_lengkap'],
            'email' => strtolower(str_replace(' ', '', $data['nama_lengkap'])) . '@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
        ]);

        // Ambil ID kelas secara acak atau buat baru jika tidak ada
        $kelasId = Kelas::inRandomOrder()->first()?->id ?? Kelas::factory()->create()->id;

        // Buat siswa dengan data yang sesuai
        Siswa::factory()->create(array_merge($data, [
            'user_id' => $user->id,
            'id_kelas' => $kelasId,
        ]));
    }
}
