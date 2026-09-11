<?php

namespace App\Services;

use App\Models\Transport;
use App\Models\TransportStop;
use App\Models\TransportStudent;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TransportService
{
    public function getAllTransport(int $perPage = 15): LengthAwarePaginator
    {
        return Transport::with(['stops'])
            ->withCount(['stops', 'students'])
            ->orderBy('route_name')
            ->paginate($perPage);
    }

    public function getTransportById(int $id): Transport
    {
        return Transport::with([
            'stops',
            'students.student',
            'students.stop',
        ])->withCount(['stops', 'students'])->findOrFail($id);
    }

    public function createTransport(array $data): Transport
    {
        return DB::transaction(function () use ($data) {
            $stops = $data['stops'] ?? [];
            unset($data['stops']);

            $transport = Transport::create($data);
            $this->syncStops($transport, $stops);

            return $this->getTransportById($transport->id);
        });
    }

    public function updateTransport(Transport $transport, array $data): Transport
    {
        return DB::transaction(function () use ($transport, $data) {
            $stops = $data['stops'] ?? null;
            unset($data['stops']);

            $transport->update($data);

            if (is_array($stops)) {
                $this->syncStops($transport, $stops);
            }

            return $this->getTransportById($transport->id);
        });
    }

    public function deleteTransport(Transport $transport): void
    {
        $transport->delete();
    }

    public function addStop(int $transportId, array $data): TransportStop
    {
        $transport = Transport::findOrFail($transportId);

        $order = $data['order'] ?? ($transport->stops()->max('order') + 1);

        return $transport->stops()->create([
            'stop_name' => $data['stop_name'],
            'pickup_time' => $data['pickup_time'] ?? null,
            'drop_time' => $data['drop_time'] ?? null,
            'order' => $order,
        ]);
    }

    public function deleteStop(int $transportId, int $stopId): void
    {
        TransportStop::where('transport_id', $transportId)
            ->where('id', $stopId)
            ->firstOrFail()
            ->delete();
    }

    public function assignStudentToTransport(int $transportId, int $studentId, int $stopId): TransportStudent
    {
        return DB::transaction(function () use ($transportId, $studentId, $stopId) {
            $transport = Transport::withCount('students')->findOrFail($transportId);

            TransportStop::where('transport_id', $transportId)->findOrFail($stopId);

            $existing = TransportStudent::where('student_id', $studentId)->first();

            if ($existing && $existing->transport_id !== $transportId) {
                throw new Exception('A diák már másik járathoz van rendelve.');
            }

            if (!$existing && $transport->students_count >= $transport->capacity) {
                throw new Exception('A járat megtelt.');
            }

            return TransportStudent::updateOrCreate(
                [
                    'transport_id' => $transportId,
                    'student_id' => $studentId,
                ],
                [
                    'stop_id' => $stopId,
                ]
            )->load(['student', 'stop']);
        });
    }

    public function removeStudentFromTransport(int $transportId, int $studentId): void
    {
        TransportStudent::where('transport_id', $transportId)
            ->where('student_id', $studentId)
            ->delete();
    }

    private function syncStops(Transport $transport, array $stops): void
    {
        $keepIds = [];

        foreach ($stops as $index => $stopData) {
            $payload = [
                'stop_name' => $stopData['stop_name'],
                'pickup_time' => $stopData['pickup_time'] ?? null,
                'drop_time' => $stopData['drop_time'] ?? null,
                'order' => $stopData['order'] ?? ($index + 1),
            ];

            if (!empty($stopData['id'])) {
                $stop = TransportStop::where('transport_id', $transport->id)
                    ->where('id', $stopData['id'])
                    ->firstOrFail();
                $stop->update($payload);
                $keepIds[] = $stop->id;
            } else {
                $stop = $transport->stops()->create($payload);
                $keepIds[] = $stop->id;
            }
        }

        $query = TransportStop::where('transport_id', $transport->id);

        if (count($keepIds) > 0) {
            $query->whereNotIn('id', $keepIds);
        }

        $query->delete();
    }
}
