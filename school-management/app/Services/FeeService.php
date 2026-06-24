<?php

namespace App\Services;

use App\Models\Fee;
use App\Models\Student;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class FeeService
{
    // Az összes díj lekérdezése.. Admin dashboardhoz tökéletes..
    public function getAllFees(int $perPage = 15): LengthAwarePaginator
    {
        return Fee::with(['student'])
            ->orderBy('due_date', 'desc')
            ->paginate($perPage);
    }

    // Egy díj lekérdezése id alapján..
    public function getFeeById(int $id): Fee
    {
        return Fee::with(['student'])->findOrFail($id);
    }

    // Ez egy diáknak az összes dijának a lekérdezése
    public function getStudentFee(Student $student): Collection
    {
        return $student->fees()
            ->orderBy('due_date')
            ->get();
    }


    // Az összes lejárt, be nem fizetett dij lekérdezése. Erről kapok egy listát..
    public function getOverdueFees(int $perPage = 15): LengthAwarePaginator
    {
        return Fee::with(['student'])
            ->where('status', 'pending')
            ->where('due_date', '<', now())
            ->orderBy('due_date')
            ->paginate($perPage);
    }

    // Új dij létrehozása
    // a receipt_numbert csak a tényleg befizett dijjnál kell generálni, ami még nincs fizetve nem kell neki bizonylatszám.
    public function createFee(array $data): Fee
    {
        if (isset($data['status']) === 'paid') {
            $data['receipt_number'] = $this->generateReceiptNumber();
            $data['paid_date'] = $data['paid_date'] ?? now()->toDateString();
        }

        return Fee::create($data);
    }

    // Díj adatainak a frissitése..
    public function updateFee(Fee $fee, array $data): Fee
    {
        $fee->update($data);
        return $fee->fresh();
    }

    // Dij törlése..
    public function deleteFee(Fee $fee): void
    {
        $fee->delete();
    }

    // Egyedi bizonylatszám generálása..
    private function generateReceiptNumber(): string
    {
        $year = now()->year;
        $count = Fee::whereYear('created_at', $year)->count() + 1;
        $number = str_pad($count, 6, '0', STR_PAD_LEFT);

        return "RCP-{$year}-{$number}";
    }

    // Díj befizetésének rögzítése.. olyan mint egy sima update..
    public function markAsPaid(Fee $fee): Fee
    {
        $fee->update([
            'status' => 'paid',
            'paid_date' => now()->toDateString(),
            'receipt_number' => $this->generateReceiptNumber(),
        ]);

        return $fee->fresh();
    }

    // Lejárt díjak automatikus státusz frissítése..
    public function updateOverdueStatuses(): int
    {
        return Fee::where('status', 'pending')
            ->where('due_date', '<', now())
            ->update(['status' => 'overdue']);
    }
}
