<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\StoreTeacherAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Services\AttendanceService;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;


class AttendanceController extends Controller
{

    public function __construct(
        private AttendanceService $attendanceService,
        private StudentService $studentService
    ) {}

    // Diák jelenlétének tömeges rögzítése egy osztályban..
    public function storeStudents(StoreAttendanceRequest $request): AnonymousResourceCollection
    {
        $class = $this->attendanceService->getClassById($request->input('class_id'));

        $attendances = $this->attendanceService->recordClassAttendance(
            $class,
            $request->input('date'),
            $request->input('attendances')
        );

        return AttendanceResource::collection($attendances);
    }

    // Osztály jelenlétének lekérdezése egy adott napra..
    public function byClass(int $classId, Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'date' => 'required|date|date_format:Y-m-d'
        ]);

        $class = $this->attendanceService->getClassById($classId);

        $attendances = $this->attendanceService->getClassAttendanceByDate(
            $class,
            $request->input('date')
        );

        return AttendanceResource::collection($attendances);
    }


    // Tanár jelenléti tömeges rögzítése..
    public function storeTeachers(StoreTeacherAttendanceRequest $request): AnonymousResourceCollection
    {
        $class = $this->attendanceService->getClassById($request->input('class_id'));

        $attendances = $this->attendanceService->recordTeacherAttendance(
            $class,
            $request->input('date'),
            $request->input('attendances')
        );

        return AttendanceResource::collection($attendances);
    }

    // Egy diák jelenléti statisztikája..
    public function studentStats(int $studentId, Request $request): JsonResponse
    {

        $request->validate([
            'from' => 'nullable|date|date_format:Y-m-d',
            'to' => 'nullable|date|date_format:Y-m-d|after_or_equal:from',
        ]);

        $student = $this->studentService->getStudentById($studentId);

        /**
         * A Service kiszámítja a statisztikákat.
         * Visszaadunk egy plain JSON objektumot, nem Resource-t,
         * mert ez nem egy Model – számított adat.
         */
        $stats = $this->attendanceService->getStudentAttendanceStats(
            $student,
            request()->input('from'),
            request()->input('to')
        );

        return response()->json([
            'data' => $stats
        ]);
    }

    // Egy osztály teljes jelenléti előzménye..
    public function classHistory(int $classId, Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'from' => 'nullable|date|date_format:Y-m-d',
            'to'   => 'nullable|date|date_format:Y-m-d|after_or_equal:from',
        ]);

        $class = $this->attendanceService->getClassById($classId);

        $attendance = $this->attendanceService->getClassAttendaceHistory(
            $class,
            $request->input('from'),
            $request->input('to')
        );

        return AttendanceResource::collection($attendance);
    }
}
