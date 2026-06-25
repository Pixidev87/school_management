<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TimetableResource;
use App\Services\TimetableService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TimetableController extends Controller
{

    public function __construct(
        private TimetableService $timetableService
    ) {}

    // Egy osztály teljes órarendje..
    public function byClass(int $classId): AnonymousResourceCollection
    {
        $timetables = $this->timetableService->getClassTimetable($classId);
        return TimetableResource::collection($timetables);
    }

    // Egy osztály órarendje egy adott napra..
    public function byClassAndDay(Request $request, int $classId): AnonymousResourceCollection
    {
        $request->validate([
            'day' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday'
        ]);

        $timetables = $this->timetableService->getClassTimetableByDay(
            $classId,
            $request->input('day')
        );

        return TimetableResource::collection($timetables);
    }


    public function store(Request $request): TimetableResource
    {
        $validated = $request->validate([
            'class_id'   => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'day'        => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i|after:start_time',
            'room'       => 'nullable|string|max:100',
        ]);

        $timetable = $this->timetableService->createTimetable($validated);

        return new TimetableResource($timetable);
    }

    // Órarend bejegyzés frissitése..
    public function update(Request $request, int $id): TimetableResource
    {
        $validated = $request->validate([
            'class_id'   => 'sometimes|required|exists:classes,id',
            'subject_id' => 'sometimes|required|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'day'        => 'sometimes|required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time'   => 'sometimes|required|date_format:H:i|after:start_time',
            'room'       => 'nullable|string|max:100',
        ]);

        $timetable = $this->timetableService->getTimetableById($id);
        $timetable = $this->timetableService->updateTimetable(
            $timetable,
            $validated
        );

        return new TimetableResource($timetable);
    }

    // Órarend bejegyzés törlése..
    public function destroy(int $id): JsonResponse
    {
        $timetable = $this->timetableService->getTimetableById($id);
        $this->timetableService->deleteTimetable($timetable);

        return response()->json([
            'message' => 'Órarend bejegyzés sikeresen törölve.'
        ]);
    }
}
