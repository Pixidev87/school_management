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

    public function storeClass(StoreAttendanceRequest $request): AnonymousResourceCollection
    {
        $class = $this->attendanceService->getClassById($request->input('class_id'));

        $attendances = $this->attendanceService->recordClassAttendance(
            $class,
            $request->input('date'),
            $request->input('attendance')
        );

        return AttendanceResource::collection($attendances);
    }

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

    public function studentStats(int $studentId): JsonResponse
    {

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
}
