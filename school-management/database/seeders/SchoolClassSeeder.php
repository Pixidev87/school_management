<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            ['name' => '9A', 'section' => 'A', 'room_number' => '101'],
            ['name' => '9B', 'section' => 'B', 'room_number' => '102'],
            ['name' => '10A', 'section' => 'A', 'room_number' => '201'],
            ['name' => '10B', 'section' => 'B', 'room_number' => '202'],
        ];

        foreach ($classes as $class) {
            SchoolClass::updateOrCreate(
                ['name' => $class['name']],
                $class
            );
        }

        $this->command->info('Teszt oszályok létrehozva!');
    }
}
