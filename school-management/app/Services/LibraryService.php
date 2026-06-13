<?php

namespace App\Services;

use App\Models\Library_book;
use App\Models\Library_issues;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class LibraryService
{

    // Az összes könyv lekérdezése.. itt az összesbe beletartozik amit már kikölcsönöztek és ami még van a könyvtárban is..
    public function getAllBooks(int $perPage = 15, bool $onlyAvailable = false): LengthAwarePaginator
    {
        $query = Library_book::query();

        if ($onlyAvailable) {
            $query->where('available_copies', '>', 0);
        }

        return $query->orderBy('title')->paginate($perPage);
    }

    // könyv kölcsönzése..
    // transaction(), mert ha a könyv kölcsönzése sikeres és a csökkentés nem akkor nem müködhet. így vagy mindkettő vagy egyik sem..
    public function issueBook(Library_book $book, array $data): Library_issues
    {
        if ($book->available_copies <= 0) {
            throw new Exception('Nincs elérhető példány ebből a könyvből');
        }

        return DB::transaction(function () use ($book, $data) {
            $issue = Library_issues::create([
                'book_id' => $book->id,
                'student_id' => $data['student_id'] ?? null,
                'teacher_id' => $data['teacher_id'] ?? null,
                'issues_date' => now()->toDateString(),
                'due_date' => $data['due_date'],
                'status' => 'issued',
                'fine' => 0,
            ]);

            $book->decrement('available_copies');

            return $issue;
        });
    }


    // könyv visszahozásának rögzítése.. ha kell bírságot számolni itt számolom azt is ki..
    public function returnBook(Library_issues $issue): Library_issues
    {
        return DB::transaction(function () use ($issue) {
            $fine = $this->calculateFine($issue);

            $issue->update([
                'return_date' => now()->toDateString(),
                'status' => 'returned',
                'fine' => $fine,
            ]);
            // növeljük az elérhető példányszámot a könyvtárban..
            $issue->increment('available_copies');

            return $issue->fresh();
        });
    }

    // késedelmi díj kiszámitása. Napi 50ft birság a lejárat után.. Ha nincs késés akkor 0.
    private function calculateFine(Library_issues $issue): float
    {
        $today = now()->startOfDay();
        $dueDate = Carbon::parse($issue->due_date)->startOfDay();

        if ($today > $dueDate) {
            return 0;
        }

        $daysLate = $today->diffInDays($dueDate);

        return $daysLate * 50;
    }
}