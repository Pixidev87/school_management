<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;


class StudentController extends Controller
{

    // Depedency Injection alkalmazása a controllerben.. Így a StudentService lett betöltve ide..
    public function __construct(
        private StudentService $studentService
    ) {}

    // Az összes diák listázása lapozással.. Visszaadom őket a StudentResource-al formázva..
    // Route: GET /api/students
    public function index(): AnonymousResourceCollection
    {
        $student = $this->studentService->getAllStudents();

        return StudentResource::collection($student);
    }

    // Új diák létrehozása.. a request validálja az érkező adatokat.. azért new StudentResource mert egy objektumot adunk vissza és nem egy listát mint a collection-nél..
    // Route: POST /api/students
    public function store(StoreStudentRequest $request): StudentResource
    {
        $student = $this->studentService->createStudent($request->validated());

        return new StudentResource($student);
    }

    // Egy konkrét diák adatai az összes kapcsolatával..
    // Route: GET /api/students/{student}
    public function show(int $id): StudentResource
    {
        $student = $this->studentService->getStudentById($id);

        return new StudentResource($student);
    }

    // Egy diák adatainak a frissitése..
    // Route: PUT /api/students/{student}
    public function update(UpdateStudentRequest $request, int $id): StudentResource
    {
        $student = $this->studentService->getStudentById($id);
        $student = $this->studentService->updateStudent($student, $request->validated());

        return new StudentResource($student);
    }

    // Egy diák törlése (soft delete)..
    // Route: DELETE /api/students/{student}
    public function destroy(int $id): JsonResponse
    {
        $student = $this->studentService->getStudentById($id);

        $this->studentService->deleteStudent($student);

        return response()->json([
            'message' => 'Diák sikeresen törölve lett..',
        ]);
    }
}
