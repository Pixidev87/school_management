<?php

namespace App\Services;

use App\Models\LibraryBook;
use App\Models\LibraryIssue;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class LibraryService
{

    // Az összes könyv lekérdezése.. itt az összesbe beletartozik amit már kikölcsönöztek és ami még van a könyvtárban is..
    public function getAllBooks(int $perPage = 15, bool $onlyAvailable = false): LengthAwarePaginator
    {
        $query = LibraryBook::query();

        if ($onlyAvailable) {
            $query->where('available_copies', '>', 0);
        }

        return $query->orderBy('title')->paginate($perPage);
    }

    // Egy könyv lekérdezése id alapján..
    public function getBookById(int $id): LibraryBook
    {
        return LibraryBook::with([
            'issues.student',
            'issues.teacher'
        ])->findOrFail($id);
    }

    // Új könyv létrehozása..
    public function createBook(array $data): LibraryBook
    {
        return LibraryBook::create($data);
    }

    // Könyv adatainak a frissítése..
    public function updateBook(LibraryBook $LibraryBook, array $data): LibraryBook
    {
        $LibraryBook->update($data);
        return $LibraryBook->fresh();
    }

    // Egy könyv törlése..
    public function deleteBook(LibraryBook $LibraryBook): void
    {
        $LibraryBook->delete();
    }

    // Egy kölcsönzés lekérése id alapján.. 
    public function getIssuesById(int $id): LibraryIssue
    {
        return LibraryIssue::with(['book', 'student', 'teacher'])->findOrFail($id);
    }

    // Aktiv kölcsönzések.. Ezt az admin láthatja ki,mit kölcsönzött ki és mikor kell visszahozni..
    public function getActiveIssues(int $perPage = 15): LengthAwarePaginator
    {
        return LibraryIssue::with(['book', 'student', 'teacher'])
            ->where('status', 'issued')
            ->orderBy('due_date')
            ->paginate($perPage);
    }

    // Lejárt kölcsönzések lekérése.. 
    public function getOverdueIssues(int $perPage = 15): LengthAwarePaginator
    {
        return LibraryIssue::with(['book', 'student', 'teacher'])
            ->where('status', 'issued')
            ->where('due_date', '<', now())
            ->orderBy('due_date')
            ->paginate($perPage);
    }

    // könyv kölcsönzése..
    // transaction(), mert ha a könyv kölcsönzése sikeres és a csökkentés nem akkor nem müködhet. így vagy mindkettő vagy egyik sem..
    public function issueBook(LibraryBook $book, array $data): LibraryIssue
{
    if ($book->available_copies <= 0) {
        throw new Exception('Nincs elérhető példány ebből a könyvből.');
    }

    return DB::transaction(function () use ($book, $data) {
        $issue = LibraryIssue::create([
            'book_id'    => $book->id,
            'student_id' => $data['student_id'] ?? null,
            'teacher_id' => $data['teacher_id'] ?? null,
            'issue_date' => now()->toDateString(),
            'due_date'   => $data['due_date'],
            'status'     => 'issued',
            'fine'       => 0,
        ]);

        $book->decrement('available_copies');

        return $issue;
    });
}


    // könyv visszahozásának rögzítése.. ha kell bírságot számolni itt számolom azt is ki..
    public function returnBook(LibraryIssue $issue): LibraryIssue
    {
        return DB::transaction(function () use ($issue) {
            $fine = $this->calculateFine($issue);

            $issue->update([
                'return_date' => now()->toDateString(),
                'status' => 'returned',
                'fine' => $fine,
            ]);
            // növeljük az elérhető példányszámot a könyvtárban (könyv rekord, nem a kölcsönzés)
            $issue->book()->increment('available_copies');

            return $issue->fresh();
        });
    }

    // késedelmi díj kiszámitása. Napi 50ft birság a lejárat után.. Ha nincs késés akkor 0.
    private function calculateFine(LibraryIssue $issue): float
    {
        $today = now()->startOfDay();
        $dueDate = Carbon::parse($issue->due_date)->startOfDay();

        if ($today <= $dueDate) {
            return 0;
        }

        $daysLate = $today->diffInDays($dueDate);

        return $daysLate * 50;
    }
}
