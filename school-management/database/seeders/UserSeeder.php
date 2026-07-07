<?php

namespace Database\Seeders;

use App\Models\Guardian;
use App\Models\Student;
use App\Models\Teacher;
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
            ['email' => 'admin@school.com'],
            [
                'name' => 'Adminisztrátor',
                'password' => Hash::make('admin123'),
                'role' => 'admin'
            ]
        );

        // TANÁR felhasználó + Teacher rekord összekötve..
        $teacherUser = User::updateOrCreate(
            ['email' => 'teacher@school.com'],
            [
                'name' => 'Tanár',
                'password' => Hash::make('teacher123'),
                'role' => 'teacher'
            ]
        );

        Teacher::updateOrCreate(
            ['email' => 'teacher@school.com'],
            [
                'user_id' => $teacherUser->id,
                'name' => 'Kovács Tamás',
                'phone' => '+36301111111',
                'qualification' => 'Matematika-Fizika',
                'joining_date' => now()->subYears(3),
            ]
        );

        // SZÜLŐ felhasználó + Guardian rekord összekötve..
        $parentUser = User::updateOrCreate(
            ['email' => 'parent@school.com'],
            [
                'name' => 'Szülő',
                'password' => Hash::make('parent123'),
                'role' => 'parent'
            ]
        );

        $firstStudent = Student::first();

        if ($firstStudent) {
            Guardian::updateOrCreate(
                ['email' => 'parent@school.com'],
                [
                    'user_id'       => $parentUser->id,
                    'guardian_name' => 'Nagy Szülő',
                    'phone'         => '+36309876543',
                    'relationship'  => 'father',
                    'student_id'    => $firstStudent->id,
                ]
            );
        }

        $this->command->info('Teszt felhasználók létrehozva..');
        $this->command->info(' ADMIN : admin@school.com / admin123');
        $this->command->info(' TEACHER : teacher@school.com / teacher123');
        $this->command->info(' PARENT : parent@school.com / parent123');
    }
}
