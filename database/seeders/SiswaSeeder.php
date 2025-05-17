<?php

namespace Database\Seeders;

use App\Models\Kelas;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Siswa;
use Faker\Factory as Faker;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $kelasIds = Kelas::pluck('id')->toArray();

        // Static test profile
        $testUser = User::where('email', 'siswa@test.com')->first();
        $testUser = User::where('email', 'siswa@test.com')->first();
        if ($testUser && !Siswa::where('user_id', $testUser->id)->exists()) {
            Siswa::create([
                'user_id' => $testUser->id,
                'nama_lengkap' => 'Siswa Test',
                'jenis_kelamin' => 'L',
                'tanggal_lahir' => '2006-01-01',
                'alamat' => 'Jl. Test No. 123, Tangerang Selatan',
                'no_telp' => '081234567890',
                'nisn' => '1234567890',
                'nis' => '202300001',
                'semester' => 1,
                'id_kelas' => $kelasIds[0] ?? null
            ]);
        }

        // Ambil user yang memiliki privilege isSiswa = true dan belum memiliki data di tabel siswa
        $siswaUsers = User::where('profile', 'siswa')
            ->whereNotIn('id', Siswa::pluck('user_id'))
            ->get();

        foreach ($siswaUsers as $user) {
            Siswa::create([
                'user_id' => $user->id,
                'nama_lengkap' => $user->name,
                'jenis_kelamin' => $faker->randomElement(['L', 'P']),
                'tanggal_lahir' => $faker->date('Y-m-d', '-15 years'),
                'alamat' => $faker->address,
                'no_telp' => $faker->phoneNumber,
                'nisn' => '10' . str_pad($user->id, 8, '0', STR_PAD_LEFT),
                'nis' => '2023' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'semester' => rand(1, 6),
                'id_kelas' => $faker->randomElement($kelasIds) ?? null
            ]);
        }
    }
}
