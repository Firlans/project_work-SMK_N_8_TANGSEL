<?php

namespace Database\Seeders;

use App\Models\Privilege;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductionSeeder extends Seeder
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

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'SuperAdmin',
                'email' => 'superadmin@domain.com',
                'password' => Hash::make('SuperSecurePassword123'),
                'profile' => 'guru',
            ],
            [
                'name' => 'Administrator',
                'email' => 'admin@domain.com',
                'password' => Hash::make('SMKN8tangsel'),
                'profile' => 'guru'
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);
            $this->createPrivilege($user->id, $userData['email'], $userData['profile']);
        }
    }
}
