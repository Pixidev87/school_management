<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Pagination\LengthAwarePaginator;
use Ramsey\Collection\Collection;

class StudentService
{

    // összes diák lekérdezése lapozással.. a paginate az aktuális oldal rekordjait kéri le azért nem használok itt get()-et.
    public function getAllStudents(int $perPage = 15): LengthAwarePaginator
    {
        return Student::with(['schoolClass'])->orderBy('name')->paginate($perPage);
    }


    // egy diák lekérdezése az összes kapcsolatával együtt.. N+1 probléma elkerülve a with() metódussal.
    // findOrFail() 404-et dob ha nem találja a diákot.
    public function getStudentById(int $id): Student
    {
        return Student::with([
            'schoolClass',
            'guardians',
            'attendances',
            'examResults',
            'fees'
        ])->findOrFail($id);
    }


    // Új diák létrehozása..
    public function createStudent(array $data): Student
    {
        $data['roll_number'] = $this->generateRollNumber();

        return Student::create($data);
    }


    /* Egyedi roll_number generálás az új diák létrehozásához
        Formátum: STU-2026-00001
        STU   = Student prefix
        2026  = aktuális év
        00001 = sorszám, az adatbázisban lévő diákok száma + 1
        withTrashed() -> mert lehetnek törölt diákok és hogy az újjak ne kaphassák meg a törölt diákok egyedi azonosítóját.
        str_pad($szoveg, $kivant_hossz, $potlo_karakter, STR_PAD_LEFT)
    */
    private function generateRollNumber(): string
    {
        $year = now()->year;
        $count = Student::withTrashed()->count() + 1;
        $number = str_pad($count, 5, '0', STR_PAD_LEFT);

        return "STU-{$year}-{$number}";
    }

    // Diák adatainak a frissitése.. Frissitjük az objektumot az adatbázisból..
    public function updateStudent(Student $student, array $data): Student
    {
        $student->update($data);

        return $student->fresh();
    }

    // Diák törlése.. delete() nem fizikai törlés lesz, mert a SoftDelete trait be van kapcsolvaa modellben.. A delete_at mező kap egy értéket, de az adat megmarad a DB-ben..
    public function deleteStudent(Student $student): void
    {
        $student->delete();
    }

    public function getStudentsByClass(int $classId): Collection
    {
        return Student::where('class_id', $classId)
            ->orderBy('name')
            ->get();
    }
}
