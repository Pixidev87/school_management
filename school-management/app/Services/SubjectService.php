<?php

namespace App\Services;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class SubjectService
{

    // Az összes tantárgy lekérdezése lapozással.. Megtudjuk mutatni, hogy melyik tanár tanitja az adott tantárgyat, azért a kapcsolat..
    public function getAllSubjects(int $perPage = 15): LengthAwarePaginator
    {
        return Subject::with(['teacher'])->orderBy('name')->paginate($perPage);
    }

    // Egy tantárgy lekérdezése az összes kapcsolatával..
    public function getSubjectId(int $id): Subject
    {
        return Subject::with([
            'teacher',
            'timetables.schoolClass',
            'exams.schoolClass',
        ])->findOrFail($id);
    }

    // Új tantárgy létrehozása..
    public function createSubject(array $data): Subject
    {
        return Subject::create($data);
    }

    // Tantárgy adatainak frissitése..
    public function updateSubject(Subject $subject, array $data): Subject
    {
        $subject->update($data);
        return $subject->fresh();
    }

    // Tantárgy törlése.. (soft delete)
    public function deleteSubject(Subject $subject): void
    {
        $subject->delete();
    }

    // Egy tanár összes tantárgyának a lekérdezése. A tanár profil oldalán megmutathatom, milyen tantárgyakat tanít..
    public function getSubjectByTeacher(int $teacherId): Collection
    {
        return Subject::with(['teacher'])
            ->where('teacher_id', $teacherId)
            ->orderBy('name')
            ->get();
    }
}
