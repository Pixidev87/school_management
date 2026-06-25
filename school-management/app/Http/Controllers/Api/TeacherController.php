<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Http\Resources\TimetableResource;
use App\Services\TeacherService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;


class TeacherController extends Controller
{
    public function __construct(
        private TeacherService $teacherService
    ) {}


    public function index(): AnonymousResourceCollection
    {
        $teachers = $this->teacherService->getAllTeachers();
        return TeacherResource::collection($teachers);
    }


    public function store(StoreTeacherRequest $request): TeacherResource
    {
        $teacher = $this->teacherService->createTeacher($request->validated());
        return new TeacherResource($teacher);
    }


    public function show(int $id): TeacherResource
    {
        $teacher = $this->teacherService->getTeacherById($id);
        return new TeacherResource($teacher);
    }


    public function update(UpdateTeacherRequest $request, int $id): TeacherResource
    {
        $teacher = $this->teacherService->getTeacherById($id);
        $teacher = $this->teacherService->updateTeacher($teacher, $request->validated());

        return new TeacherResource($teacher);
    }


    public function destroy(int $id): JsonResponse
    {
        $teacher = $this->teacherService->getTeacherById($id);
        $this->teacherService->deleteTeacher($teacher);

        return response()->json([
            'message' => 'Tanár sikeresen törölve!'
        ]);
    }

    // Egy tanár napi beosztása.. Itt elég validálni, ehhez nem kell külön form request..
    public function schedule(int $id, Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'day' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday'
        ]);

        $teacher = $this->teacherService->getTeacherById($id);
        $schedule = $this->teacherService->getTeacherScheduleByDay($teacher, $request->input('day'));

        return TimetableResource::collection($schedule);
    }
}
