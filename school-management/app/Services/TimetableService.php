<?php

namespace App\Services;

use App\Models\Timetable;
use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Collection;

class TimetableService
{

    // Egy osztály teljes órarendjének a lekérdezése..
    public function getClassTimetable(int $classId): Collection
    {
        return Timetable::with(['subject', 'teacher', 'schoolClass'])
            ->where('class_id', $classId)
            ->orderByRaw("FIELD(day, 'monday' , 'tuesday' , 'wednesday' , 'thursday' , 'friday' , 'saturday')")
            ->orderBy('start_time')
            ->get();
    }

    // Egy nap órarendje egy osztálynak..
    public function getClassTimetableByDay(int $classId, string $day): Collection
    {
        return Timetable::with(['subject', 'teacher'])
            ->where('class_id', $classId)
            ->where('day', $day)
            ->orderBy('start_time')
            ->get();
    }

    // Új órarend bejegyzés létrehozása..
    public function createTimetable(array $data): Timetable
    {
        return Timetable::create($data);
    }

    // Órarend frissítése..
    public function updateTimetable(Timetable $timetable, array $data): Timetable
    {
        $timetable->update($data);
        return $timetable->fresh();
    }

    // Órarend törlése..
    public function deleteTimetabla(Timetable $timetable): void
    {
        $timetable->delete();
    }
}
