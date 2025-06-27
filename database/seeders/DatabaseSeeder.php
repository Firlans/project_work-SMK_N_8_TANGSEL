<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if(env('APP_ENV') === 'production') {
            $this->call(ProductionSeeder::class);
        } else {
            $this->call(DevelopmentSeeder::class);
        }
    }
}
