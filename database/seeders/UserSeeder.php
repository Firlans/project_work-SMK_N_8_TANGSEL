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
            'is_superadmin' => false,
            'is_admin' => false,
            'is_guru' => false,
            'is_siswa' => false,
            'is_conselor' => false,
        ];

        // Set privileges based on email/profile
        if($email === 'superadmin@test.com'){
            $privilege['is_superadmin'] = true;
            $privilege['is_guru'] = true;
        }elseif ($email === 'admin@test.com') {
            $privilege['is_admin'] = true;
            $privilege['is_guru'] = true;
        } elseif ($email === 'konselor@test.com') {
            $privilege['is_conselor'] = true;
            $privilege['is_guru'] = true;
        } elseif ($profile === 'guru') {
            $privilege['is_guru'] = true;
        } elseif ($profile === 'siswa') {
            $privilege['is_siswa'] = true;
        }

        Privilege::create($privilege);
    }

    public function run()
    {
        $faker = Faker::create('id_ID');

        // Static test users
        $staticUsers = [
            [
                'name' => 'Super Admin Test',
                'email' => 'superadmin@test.com',
                'password' => Hash::make('password123'),
                'profile' => 'guru'
            ],
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