<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Siswa;

class SiswaFactory extends Factory
{
    protected $model = Siswa::class;

    public function definition(): array
{
    return [
        'user_id' => User::factory()->create(['role' => 'siswa'])->id,
        'nama_lengkap' => $this->faker->name,
        'jenis_kelamin' => $this->faker->randomElement(['L', 'P']),
        'tanggal_lahir' => $this->faker->date('Y-m-d', '-16 years'),
        'alamat' => $this->faker->address,
        'no_telp' => $this->faker->phoneNumber,
        'nisn' => $this->faker->unique()->numerify('##########'), // 10 digits
        'nis' => $this->faker->unique()->numerify('######'), // 6 digits
        'id_kelas' => Kelas::inRandomOrder()->first()?->id ?? Kelas::factory()->create()->id,
        'created_at' => now(),
        'updated_at' => now(),
    ];
}

}
