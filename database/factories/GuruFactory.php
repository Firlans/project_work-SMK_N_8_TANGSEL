<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Guru;
use App\Models\User;

class GuruFactory extends Factory
{
    protected $model = Guru::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Pastikan User dibuat saat Guru dibuat
            'nama' => $this->faker->name(),
            'role' => $this->faker->randomElement(['Admin', 'Guru']),
            'jenis_kelamin' => $this->faker->randomElement(['L', 'P']), // 'L' untuk Laki-laki, 'P' untuk Perempuan
            'nip' => $this->faker->unique()->numerify('19#########'), // Generate NIP unik dengan angka
        ];
    }
}
