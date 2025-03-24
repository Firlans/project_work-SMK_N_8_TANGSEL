<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Guru;
use Faker\Factory as Faker;

class GuruSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Create static test profiles
        $staticProfiles = [
            [
                'email' => 'admin@test.com',
                'nama' => 'Admin Test',
                'jenis_kelamin' => 'L',
                'nip' => '199001012020011001',
                'tanggal_lahir' => '1990-01-01',
                'alamat' => 'Jl. Admin No. 1',
                'no_telp' => '081234567890'
            ],
            [
                'email' => 'counselor@test.com',
                'nama' => 'Counselor Test',
                'jenis_kelamin' => 'P',
                'nip' => '199101012020011002',
                'tanggal_lahir' => '1991-01-01',
                'alamat' => 'Jl. Konselor No. 2',
                'no_telp' => '081234567891'
            ],
            [
                'email' => 'guru@test.com',
                'nama' => 'Guru Test',
                'jenis_kelamin' => 'L',
                'nip' => '199201012020011003',
                'tanggal_lahir' => '1992-01-01',
                'alamat' => 'Jl. Guru No. 3',
                'no_telp' => '081234567892'
            ],
        ];

        foreach ($staticProfiles as $profile) {
            $user = User::where('email', $profile['email'])->first();
            if ($user) {
                Guru::create([
                    'user_id' => $user->id,
                    'nama' => $profile['nama'],
                    'jenis_kelamin' => $profile['jenis_kelamin'],
                    'nip' => $profile['nip'],
                    'tanggal_lahir' => $profile['tanggal_lahir'],
                    'alamat' => $profile['alamat'],
                    'no_telp' => $profile['no_telp']
                ]);
            }
        }

        // Seed Admin users
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Guru::create([
                'user_id' => $admin->id,
                'nama' => $admin->name,
                'jenis_kelamin' => $faker->randomElement(['L', 'P']),
                'nip' => '1990' . str_pad($admin->id, 8, '0', STR_PAD_LEFT),
                'tanggal_lahir' => $faker->date('Y-m-d', '2000-12-31'),
                'alamat' => $faker->address,
                'no_telp' => $faker->phoneNumber
            ]);
        }

        // Seed Counselor users
        $conselors = User::where('role', 'konselor')->get();
        foreach ($conselors as $conselor) {
            Guru::create([
                'user_id' => $conselor->id,
                'nama' => $conselor->name,
                'jenis_kelamin' => $faker->randomElement(['L', 'P']),
                'nip' => '1991' . str_pad($conselor->id, 8, '0', STR_PAD_LEFT),
                'tanggal_lahir' => $faker->date('Y-m-d', '2000-12-31'),
                'alamat' => $faker->address,
                'no_telp' => $faker->phoneNumber
            ]);
        }

        // Seed Teacher users
        $teachers = User::where('role', 'guru')->get();
        foreach ($teachers as $teacher) {
            Guru::create([
                'user_id' => $teacher->id,
                'nama' => $teacher->name,
                'jenis_kelamin' => $faker->randomElement(['L', 'P']),
                'nip' => '1992' . str_pad($teacher->id, 8, '0', STR_PAD_LEFT),
                'tanggal_lahir' => $faker->date('Y-m-d', '2000-12-31'),
                'alamat' => $faker->address,
                'no_telp' => $faker->phoneNumber
            ]);
        }
    }
}