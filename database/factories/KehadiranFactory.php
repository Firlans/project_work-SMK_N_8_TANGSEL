<?php

namespace Database\Factories;

use App\Models\Guru;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kehadiran>
 */
class KehadiranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_siswa' => Siswa::factory(),
            'tanggal' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'status' => $this->faker->randomElement(['Hadir', 'Izin', 'Sakit', 'Alfa', "Ojt", "Ijt"]),
            'guru_id' => Guru::factory(),
            'jam' => $this->faker->time(),
            'keterangan' => $this->faker->optional()->sentence()
        ];
    }
}
