<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Privilege;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    private function createPrivilege($userId, $email, $profile)
    {
        $privilege = [
            'id_user' => $userId,
            'isSuperAdmin' => false,
            'isAdmin' => false,
            'isGuru' => false,
            'isSiswa' => false,
            'isConselor' => false,
        ];

        // Set privileges based on email/profile
        if ($email === 'admin@test.com') {
            $privilege['isSuperAdmin'] = true;
            $privilege['isAdmin'] = true;
            $privilege['isGuru'] = true;
        } elseif ($email === 'konselor@test.com') {
            $privilege['isConselor'] = true;
            $privilege['isGuru'] = true;
        } elseif ($profile === 'guru') {
            $privilege['isGuru'] = true;
        } elseif ($profile === 'siswa') {
            $privilege['isSiswa'] = true;
        }

        Privilege::create($privilege);
    }

    public function run()
    {
        $faker = Faker::create('id_ID');

        // Static test users
        $staticUsers = [
            [
                'name' => 'Admin Test',
                'email' => 'admin@test.com',
                'password' => Hash::make('password123'),
                'profile' => 'guru'
            ],
            [
                'name' => 'Konselor Test',
                'email' => 'konselor@test.com',
                'password' => Hash::make('password123'),
                'profile' => 'guru'
            ],
            [
                'name' => 'Guru Test',
                'email' => 'guru@test.com',
                'password' => Hash::make('password123'),
                'profile' => 'guru'
            ],
            [
                'name' => 'Siswa Test',
                'email' => 'siswa@test.com',
                'password' => Hash::make('password123'),
                'profile' => 'siswa'
            ],
        ];

        foreach ($staticUsers as $userData) {
            $user = User::create($userData);
            $this->createPrivilege($user->id, $userData['email'], $userData['profile']);
        }

        // Create guru users
        for ($i = 0; $i < 30; $i++) {
            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'profile' => 'guru'
            ]);
            $this->createPrivilege($user->id, $user->email, 'guru');
        }

        // Create siswa users
        for ($i = 0; $i < 100; $i++) {
            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'profile' => 'siswa'
            ]);
            $this->createPrivilege($user->id, $user->email, 'siswa');
        }
    }
}