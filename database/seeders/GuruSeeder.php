<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Guru;
use App\Models\MataPelajaran;
use Faker\Factory as Faker;

class GuruSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Get all mata pelajaran IDs
        $mataPelajaranIds = MataPelajaran::pluck('id')->toArray();

        // Static test profiles (sesuaikan email dengan UserSeeder jika perlu)
        $staticProfiles = [
            [
                'email' => 'admin@test.com',
                'nama' => 'Admin Test',
                'jenis_kelamin' => 'L',
                'nip' => '199001012020011001',
                'tanggal_lahir' => '1990-01-01',
                'alamat' => 'Jl. Admin No. 1',
                'no_telp' => '081234567890',
                'mata_pelajaran_id' => $mataPelajaranIds[0] ?? null,
            ],
            [
                'email' => 'konselor@test.com',
                'nama' => 'Counselor Test',
                'jenis_kelamin' => 'P',
                'nip' => '199101012020011002',
                'tanggal_lahir' => '1991-01-01',
                'alamat' => 'Jl. Konselor No. 2',
                'no_telp' => '081234567891',
                'mata_pelajaran_id' => $mataPelajaranIds[1] ?? null,
            ],
            [
                'email' => 'guru@test.com',
                'nama' => 'Guru Test',
                'jenis_kelamin' => 'L',
                'nip' => '199201012020011003',
                'tanggal_lahir' => '1992-01-01',
                'alamat' => 'Jl. Guru No. 3',
                'no_telp' => '081234567892',
                'mata_pelajaran_id' => $mataPelajaranIds[2] ?? null,
            ],
        ];

        // Static profiles
        foreach ($staticProfiles as $profile) {
            $user = User::where('email', $profile['email'])->first();

            if ($user && !Guru::where('user_id', $user->id)->exists()) {
                Guru::create([
                    'user_id' => $user->id,
                    'mata_pelajaran_id' => $profile['mata_pelajaran_id'],
                    'nama' => $profile['nama'],
                    'jenis_kelamin' => $profile['jenis_kelamin'],
                    'nip' => $profile['nip'],
                    'tanggal_lahir' => $profile['tanggal_lahir'],
                    'alamat' => $profile['alamat'],
                    'no_telp' => $profile['no_telp']
                ]);
            }
        }

        // Ambil semua user yang memiliki privileges isGuru = true dan belum punya entry di tabel guru
        $guruUsers = User::where('profile', 'guru')
            ->whereNotIn('id', Guru::pluck('user_id'))
            ->get();

        foreach ($guruUsers as $user) {
            Guru::create([
                'user_id' => $user->id,
                'mata_pelajaran_id' => $faker->randomElement($mataPelajaranIds),
                'nama' => $user->name,
                'jenis_kelamin' => $faker->randomElement(['L', 'P']),
                'nip' => '1990' . str_pad($user->id, 8, '0', STR_PAD_LEFT),
                'tanggal_lahir' => $faker->date('Y-m-d', '2000-12-31'),
                'alamat' => $faker->address,
                'no_telp' => $faker->phoneNumber
            ]);
        }
    }
}
