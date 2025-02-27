<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Guru;
use App\Models\User;

class GuruSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan ada user terlebih dahulu
        $user = User::first() ?? User::factory()->create();

        // Seed guru dengan user_id
        Guru::factory()->count(10)->create([
            'user_id' => $user->id, // Pastikan setiap guru punya user_id
        ]);
    }
}
