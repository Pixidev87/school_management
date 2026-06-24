<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Exam_result;
use App\Models\Student;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExamService
{
    // Az összes vizsga lekérdezése..
    public function getAllExams(int $perPage = 15): LengthAwarePaginator
    {
        return Exam::with(['schoolClass', 'subject'])
            ->orderBy('exam_date', 'desc')
            ->paginate($perPage);
    }


    // Egy vizsga lekérdezése az eredményekkel együtt..
    public function getExamById(int $id): Exam
    {
        return Exam::with(['schoolClass', 'subject', 'results.student'])->findOrFail($id);
    }


    // új vizsga létrehozása
    public function createExam(array $data): Exam
    {
        return Exam::create($data);
    }

    // Vizsga adatainak a frissitése..
    public function updateExam(Exam $exam, array $data): Exam
    {
        $exam->update($data);
        return $exam->fresh();
    }

    // Vizsga törlése.. (soft delete)
    public function deleteExam(Exam $exam): void
    {
        $exam->delete();
    }


    // Vizsgaeredmények rögzitése tömeges rögzitése..
    public function recordResults(Exam $exam, $resultsData): void
    {
        DB::transaction(function () use ($exam, $resultsData) {
            foreach ($resultsData as $resultData) {

                // automatikusan kiszámitjuk az osztályzatot és a végén kap egy pass/fail státuszt..
                $grade  = $this->calculateGrade($resultData['marks_obtained'], $exam->total_marks);
                $status = $resultData['marks_obtained'] >= $exam->passing_marks ? 'pass' : 'fail';

                // UpdateOrCreate() - ha már van eredménye a diáknak ezen a vizsgán. Ha van frissitjük ha nincs létrehozzuk.
                Exam_result::updateOrCreate(
                    [
                        'exam_id' => $exam->id,
                        'student_id' => $resultData['student_id'],
                    ],

                    [
                        'marks_obtained' => $resultData['marks_obtained'],
                        'grade' => $grade,
                        'status' => $status,
                        'remarks' => $resultData['remarks'] ?? null,
                    ]
                );
            }
        });
    }

    // Az osztályzat kiszámitása pontszám alapján.. Az osztályzat a szerzett pontok százalékos arányán múlik..
    private function calculateGrade(int $marksObtained, int $totalMarks): string
    {
        $percentage = ($marksObtained / $totalMarks) * 100;

        return match (true) {
            $percentage >= 90 => 'A+',
            $percentage >= 80 => 'A',
            $percentage >= 70 => 'B+',
            $percentage >= 60 => 'B',
            $percentage >= 50 => 'C+',
            $percentage >= 40 => 'C',
            $percentage >= 30 => 'D',
            default           => 'F',
        };
    }


    // Egy vizsga statisztikáinak kiszámítására..
    // Visszaadja az átlagot, legmagasabb és legalacsonyabb pontszámot, és a sikeres vizsga arányt..
    public function getExamStatistics(Exam $exam): array
    {
        // a kapcsolattal lekérem az összes tanuló vizsgaeredményét.
        $results = $exam->results();

        if ($results->isEmpty()) {
            return [
                'total_students' => 0,
                'average' => 0,
                'highest' => 0,
                'lowest' => 0,
                'pass_count' => 0,
                'fail_count' => 0,
                'pass_rate' => 0,
            ];
        }

        // Kiszűri azokat a sorokat, ahol a status oszlop értéke 'pass' (átment), és megszámolja őket.
        // $total = megszámolja, hogy hány diák vizsgázott
        $passCount = $results->where('status', 'pass')->count();
        $total = $results->count();

        return [
            'total_students' => $total,  // vizsgázók teljes száma
            'average' => round($results->avg('marks_obtained'), 2), // kiszámolja a szerzett pontok átlagát (marks_obtained oszlop) és 2 tizedesjegyig kerekíti
            'highest' => $results->max('marks_obtained'), // megkeresi a gyűjteményben a legmagasabb elért pontszámot
            'lowest' => $results->min('marks_obtained'),  // megkeresi a gyűjteményben a legalacsonyabb elért pontszámot
            'pass_count' => $passCount, // az átment diákok száma
            'fail_count' => $results->where('status', 'fail')->count(), // kiszűri azokat akik megbuktak
            'pass_rate' => round(($passCount / $total) * 100, 2), // sikerességi ráta százalékban 2 tizedes jegyig
        ];
    }

    public function getStudentResults(Student $student): Collection
    {
        return Exam_result::with(['exam.subject'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
