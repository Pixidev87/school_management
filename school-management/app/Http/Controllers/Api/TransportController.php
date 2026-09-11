<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransportResource;
use App\Http\Resources\TransportStopResource;
use App\Http\Resources\TransportStudentResource;
use App\Services\TransportService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TransportController extends Controller
{
    public function __construct(
        private TransportService $transportService
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $transports = $this->transportService->getAllTransport();

        return TransportResource::collection($transports);
    }

    public function store(Request $request): TransportResource
    {
        $validated = $request->validate($this->transportRules());

        $transport = $this->transportService->createTransport($validated);

        return new TransportResource($transport);
    }

    public function show(int $id): TransportResource
    {
        $transport = $this->transportService->getTransportById($id);

        return new TransportResource($transport);
    }

    public function update(Request $request, int $id): TransportResource
    {
        $validated = $request->validate($this->transportRules($id));

        $transport = $this->transportService->getTransportById($id);
        $transport = $this->transportService->updateTransport($transport, $validated);

        return new TransportResource($transport);
    }

    public function destroy(int $id): JsonResponse
    {
        $transport = $this->transportService->getTransportById($id);
        $this->transportService->deleteTransport($transport);

        return response()->json([
            'message' => 'Járat sikeresen törölve.',
        ]);
    }

    public function storeStop(Request $request, int $id): TransportStopResource
    {
        $validated = $request->validate([
            'stop_name' => 'required|string|max:255',
            'pickup_time' => 'nullable|date_format:H:i',
            'drop_time' => 'nullable|date_format:H:i',
            'order' => 'nullable|integer|min:1',
        ]);

        $stop = $this->transportService->addStop($id, $validated);

        return new TransportStopResource($stop);
    }

    public function destroyStop(int $id, int $stopId): JsonResponse
    {
        $this->transportService->deleteStop($id, $stopId);

        return response()->json([
            'message' => 'Megálló sikeresen törölve.',
        ]);
    }

    public function assignStudent(Request $request, int $id): TransportStudentResource|JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'stop_id' => 'required|exists:transport_stops,id',
        ]);

        try {
            $assignment = $this->transportService->assignStudentToTransport(
                $id,
                $validated['student_id'],
                $validated['stop_id']
            );
        } catch (Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                throw $e;
            }

            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return new TransportStudentResource($assignment);
    }

    public function removeStudent(int $id, int $studentId): JsonResponse
    {
        $this->transportService->removeStudentFromTransport($id, $studentId);

        return response()->json([
            'message' => 'Diák sikeresen eltávolítva a járatról.',
        ]);
    }

    private function transportRules(?int $id = null): array
    {
        $vehicleUnique = 'unique:transports,vehicle_number';

        if ($id) {
            $vehicleUnique .= ',' . $id;
        }

        return [
            'route_name' => ($id ? 'sometimes|' : '') . 'required|string|max:255',
            'vehicle_number' => ($id ? 'sometimes|' : '') . 'required|string|max:50|' . $vehicleUnique,
            'driver_name' => ($id ? 'sometimes|' : '') . 'required|string|max:255',
            'driver_phone' => ($id ? 'sometimes|' : '') . 'required|string|max:20',
            'capacity' => ($id ? 'sometimes|' : '') . 'required|integer|min:1',
            'stops' => 'nullable|array',
            'stops.*.id' => 'nullable|integer|exists:transport_stops,id',
            'stops.*.stop_name' => 'required_with:stops|string|max:255',
            'stops.*.pickup_time' => 'nullable|date_format:H:i',
            'stops.*.drop_time' => 'nullable|date_format:H:i',
            'stops.*.order' => 'nullable|integer|min:1',
        ];
    }
}
