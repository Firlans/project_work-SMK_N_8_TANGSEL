<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SiswaFactory extends Factory
{
    protected $model = Siswa::class;

    public function definition(): array
    {
        return [
            'nama_lengkap' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // default password
            'jenis_kelamin' => $this->faker->randomElement(['L', 'P']),
            'tanggal_lahir' => $this->faker->date('Y-m-d', '-10 years'),
            'alamat' => $this->faker->address,
            'no_telp' => $this->faker->phoneNumber,
            'nisn' => $this->faker->unique()->numerify('##########'), // 10 digits
            'nis' => $this->faker->unique()->numerify('######'), // 6 digits
            'id_semester' => null, // Can be null
            'id_ayah' => null, // Can be null
            'id_ibu' => null, // Can be null
            'id_wali_murid' => null, // Can be null
            'id_kelas' => function () {
                return Kelas::inRandomOrder()->first()?->id ??
                       Kelas::factory()->create()->id;
            },
            'remember_token' => Str::random(10),
        ];
    }
}
