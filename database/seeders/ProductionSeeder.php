<?php

namespace Database\Seeders;

use App\Models\Guru;
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
        if ($email === 'smkn8tangerangselatan.com') {
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

            $profile = [
                'email' => $userData['email'],
                'nama' => $userData['name'],
                'jenis_kelamin' => 'L',
                'nip' => '**************',
                'tanggal_lahir' => '2025-07-01',
                'alamat' => 'Jl. H Jamat Gg. Rais RT. 002, RW.004, Kel. Buaran, Kec, Serpong. Kota Tangerang Selatan, Banten',
                'no_telp' => '081234567890',
            ];

            $user = User::create($userData);
            $this->createPrivilege($user->id, $userData['email'], $userData['profile']);
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
}
