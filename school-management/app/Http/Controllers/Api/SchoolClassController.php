<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClassRequest;
use App\Http\Requests\UpdateClassRequest;
use App\Http\Resources\SchoolClassResource;
use App\Http\Resources\StudentResource;
use App\Services\SchoolClassService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;


class SchoolClassController extends Controller
{

    public function __construct(
        private SchoolClassService $schoolClassService
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $classes = $this->schoolClassService->getAllClasses();
        return SchoolClassResource::collection($classes);
    }


    public function store(StoreClassRequest $request): SchoolClassResource
    {
        $class = $this->schoolClassService->createClass($request->validated());

        return new SchoolClassResource($class);
    }


    public function show(int $id): SchoolClassResource
    {
        $class = $this->schoolClassService->getClassById($id);

        return new SchoolClassResource($class);
    }


    public function update(UpdateClassRequest $request, int $id): SchoolClassResource
    {
        $class = $this->schoolClassService->getClassById($id);
        $class = $this->schoolClassService->updateClass($class, $request->validated());

        return new SchoolClassResource($class);
    }


    public function destroy(int $id): JsonResponse
    {
        $class = $this->schoolClassService->getClassById($id);
        $this->schoolClassService->deleteClass($class);

        return response()->json([
            'message' => 'Osztály sikeresen törölve!'
        ]);
    }


    // Egy osztály diákjainak a listázása.. Itt nem az összes diákot kérjük le..
    // Route: GET /api/classes/{classId}/students
    public function students(int $id): AnonymousResourceCollection
    {
        $class = $this->schoolClassService->getClassById($id);
        $students = $this->schoolClassService->getStudentsClass($class);

        return StudentResource::collection($students);
    }
}
