<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransportResource;
use App\Services\TransportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TransportController extends Controller
{
    public function __construct(
        private TransportService $transportService
    ) {}

    // Az összes járat listázása..
    public function index(): AnonymousResourceCollection
    {
        $transports = $this->transportService->getAllTransport();
        return TransportResource::collection($transports);
    }

    // Új járat létrehozása..
    public function store(Request $request): TransportResource
    {
        $validated = $request->validate([
            'route_name'     => 'required|string|max:255',
            'vehicle_number' => 'required|string|max:50|unique:transports,vehicle_number',
            'driver_name'    => 'required|string|max:255',
            'driver_phone'   => 'required|string|max:20',
            'capacity'       => 'required|integer|min:1',
        ]);

        $transport = $this->transportService->createTransport($validated);
        return new TransportResource($transport);
    }

    // Egy járat összes adatával, megállókkal és diákokkal..
    public function show(int $id): TransportResource
    {
        $transport = $this->transportService->getTransportById($id);
        return new TransportResource($transport);
    }

    // Egy járat adatainak frissítése..
    public function update(Request $request, int $id): TransportResource
    {
        $validated = $request->validate([
            'route_name'     => 'sometimes|required|string|max:255',
            'vehicle_number' => 'sometimes|required|string|max:50|unique:transports,vehicle_number,' . $id,
            'driver_name'    => 'sometimes|required|string|max:255',
            'driver_phone'   => 'sometimes|required|string|max:20',
            'capacity'       => 'sometimes|required|integer|min:1',
        ]);

        $transport = $this->transportService->getTransportById($id);
        $transport = $this->transportService->updateTransport(
            $transport,
            $validated
        );

        return new TransportResource($transport);
    }

    // Járat törlése (soft delete)..
    public function destroy(int $id): JsonResponse
    {
        $transport = $this->transportService->getTransportById($id);
        $this->transportService->deleteTransport($transport);

        return response()->json([
            'message' => 'Járat sikeresen törölve.'
        ]);
    }

    // Diák hozzárendelése egy járathoz és megállóhoz..
    public function assignStudent(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'stop_id'    => 'required|exists:transport_stops,id',
        ]);

        $this->transportService->assignStudentToTransport(
            $id,
            $validated['student_id'],
            $validated['stop_id']
        );

        return response()->json([
            'message' => 'Diák sikeresen hozzárendelve a járathoz.'
        ]);
    }

    // Diák eltávolítása egy járatról..
    public function removeStudent(int $id, int $studentId): JsonResponse
    {
        $this->transportService->removeStudentFromTransport($id, $studentId);

        return response()->json([
            'message' => 'Diák sikeresen eltávolítva a járatról.'
        ]);
    }
}
