<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ADMIN felhasználó..
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Adminisztrátor',
                'password' => Hash::make('admin1234'),
                'role' => 'admin'
            ]
        );

        // TANÁR felhasználó..
        User::updateOrCreate(
            ['email' => 'teacher@gmail.com'],
            [
                'name' => 'Tanár',
                'password' => Hash::make('teacher1234'),
                'role' => 'teacher'
            ]
        );

        // SZÜLŐ felhasználó..
        User::updateOrCreate(
            ['email' => 'parent@gmail.com'],
            [
                'name' => 'Szülő',
                'password' => Hash::make('parent1234'),
                'role' => 'parent'
            ]
        );

        $this->command->info('Teszt felhasználók létrehozva..');
        $this->command->info(' ADMIN : admin@gmail.com / admin1234 ');
        $this->command->info(' TEACHER : teacher@gmail.com / teacher1234');
        $this->command->info(' PARENT : parent@gmail.com / parent1234');
    }
}
