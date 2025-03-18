<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create static test users
        $staticUsers = [
            [
                'name' => 'Admin Test',
                'email' => 'admin@test.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Conselor Test',
                'email' => 'conselor@test.com',
                'password' => Hash::make('password123'),
                'role' => 'conselor',
            ],
            [
                'name' => 'Guru Test',
                'email' => 'guru@test.com',
                'password' => Hash::make('password123'),
                'role' => 'guru',
            ],
            [
                'name' => 'Siswa Test',
                'email' => 'siswa@test.com',
                'password' => Hash::make('password123'),
                'role' => 'siswa',
            ],
        ];

        foreach ($staticUsers as $user) {
            User::create($user);
        }

        $faker = Faker::create('id_ID');

        // Create Admin Users
        for ($i = 0; $i < 5; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]);
        }

        // Create Counselor Users
        for ($i = 0; $i < 10; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'role' => 'conselor',
            ]);
        }

        // Create Teacher Users
        for ($i = 0; $i < 30; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'role' => 'guru',
            ]);
        }

        // Create Student Users
        for ($i = 0; $i < 100; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'role' => 'siswa',
            ]);
        }
    }
}
