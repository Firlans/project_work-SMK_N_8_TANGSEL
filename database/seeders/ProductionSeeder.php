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
        if($email === 'smkn8tangerangselatan.com'){
            $privilege['is_superadmin'] = true;
        } elseif ($email === 'admin@smkn8tangerangselatan.com') {
            $privilege['is_admin'] = true;
            $privilege['is_guru'] = true;
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
                'email' => 'smkn8tangerangselatan.com',
                'password' => Hash::make('SuperSecurePassword123'),
                'profile' => 'guru',
            ],
            [
                'name' => 'Administrator',
                'email' => 'admin@smkn8tangerangselatan.com',
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
