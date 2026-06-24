<?php

namespace App\Services;

use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class SchoolClassService
{

    // Az összes osztály lekérdezése.. 
    // Frontend-nek megmutatjuk az osztályfönök nevét és a diákok számát.. a withCount egy extra oszlopot ad a lekérdezéshez eredményéhez..
    public function getAllClasses(int $perPage = 15): LengthAwarePaginator
    {
        return SchoolClass::with(['classTeacher'])
            ->withCount('students')
            ->orderBy('name')
            ->paginate($perPage);
    }

    // Egy osztály lekérdezése az össszes kapcsolatával
    public function getClassById(int $id): SchoolClass
    {
        return SchoolClass::with([
            'classTeacher',
            'students',
            'timetables.subject',
            'timetables.teacher',
            'exams.subject'
        ])->findOrFail($id);
    }

    // Egy új osztály létrehozása az iskolában
    public function createClass(array $data): SchoolClass
    {
        return SchoolClass::create($data);
    }


    // Egy oszály adatainak a frissitése
    public function updateClass(SchoolClass $schoolClass, array $data): SchoolClass
    {
        $schoolClass->update($data);

        return $schoolClass->fresh();
    }


    // Osztály törlése.. Az osztályhoz tartozó diákok nem törlődnek a student táblában a class_id is megmarad.
    public function deleteClass(SchoolClass $schoolClass): void
    {
        $schoolClass->delete();
    }

    // Egy osztály diákjainak a lekérdezése.. Csak azért mert nem mindig kell az összes adat, néha elég a diáklista
    public function getStudentsByClass(SchoolClass $schoolClass): Collection
    {
        return $schoolClass->students()->orderBy('name')->get();
    }
}
