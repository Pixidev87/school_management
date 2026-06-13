<?php

namespace App\Services;

use App\Models\Teacher;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;



class TeacherService
{

    // Összes tanár lekérdezése lapozással.. a subjects kapcsolatot pedig a frontend kiszolgálására töltöm le, hogy ha kell megmutatom miket tanitanak a tanárok..
    public function getAllTeachers(int $perPage = 15): LengthAwarePaginator
    {
        return Teacher::with(['subjects', 'classes'])->orderBy('name')->paginate($perPage);
    }

    // Egy tanár lekérdezése az összes kapcsolatával..
    // betöltöm az órarendeket és minden tantárgyat egy oszálynak..
    public function getTeacherById(int $id): Teacher
    {
        return Teacher::with([
            'subjects',
            'classes',
            'timetables.subject',
            'timetables.schoolClass'
        ])->findOrFail($id);
    }

    // Új tanár hozzáadása..
    public function createTeacher(array $data): Teacher
    {
        return Teacher::create($data);
    }

    // Tanár adatainak a frissítése..
    public function updateTeacher(Teacher $teacher, array $data): Teacher
    {
        $teacher->update($data);

        return $teacher->fresh();
    }

    // Tanár törlése.. 
    public function deleteTeacher(Teacher $teacher): void
    {
        $teacher->delete();
    }

    // Egy tanár összes órája az adott napra, frontend-en megmutathatom a tanári beosztást..
    public function getTeacherScheduleByDay(Teacher $teacher, string $day): Collection
    {
        return $teacher->timetables()
            ->with(['subject', 'schoolClass'])
            ->where('day', $day)
            ->orderBy('start_time')
            ->get();
    }
}
