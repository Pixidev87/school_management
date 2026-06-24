<?php

namespace App\Services;

use App\Models\Transport;
use App\Models\Transport_students;
use App\Models\TransportStop;
use App\Models\TransportStudent;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TransportService
{
    // Az összes járat lekérdezése lapozással..
    public function getAllTransport(int $perPage = 15): LengthAwarePaginator
    {
        return Transport::with(['stops'])
            ->orderBy('route_name')
            ->paginate($perPage);
    }

    // Egy járat lekérdezése az összes kapcsolatával..
    public function getTransportById(int $id): Transport
    {
        return Transport::with([
            'stops',
            'students.student',
            'students.stop'
        ])->findOrFail($id);
    }

    // Új járat létrehozása..
    public function createTransport(array $data): Transport
    {
        return Transport::create($data);
    }

    // Járat adatainak a frissitése..
    public function updateTransport(Transport $transport, array $data): Transport
    {
        $transport->update($data);
        return $transport->fresh();
    }

    // Járat törlése..
    public function deleteTransport(Transport $transport): void
    {
        $transport->delete();
    }

    // Diák hozzárendelése egy járathoz és megállóhoz..
    public function assignStudentToTransport(int $transportId, int $studentId, int $stopId): Transport_students
    {
        return DB::transaction(function () use ($transportId, $studentId, $stopId) {
            return Transport_students::updateOrCreate(
                [
                    'transport_id' => $transportId,
                    'student_id' => $studentId,
                ],
                [
                    'stop_id' => $stopId,
                ]
            );
        });
    }

    // Diák eltávolítása egy járatról..
    public function removeStudentFromTransport(int $transportId, int $studentId): void
    {
        Transport_students::where('transport_id', $transportId)
            ->where('student_id', $studentId)
            ->delete();
    }
}
