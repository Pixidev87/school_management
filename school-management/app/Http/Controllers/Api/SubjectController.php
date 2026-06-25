<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Http\Resources\SubjectResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\SubjectService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubjectController extends Controller
{

    public function __construct(
        private SubjectService $subjectService
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $subjects = $this->subjectService->getAllSubjects();
        return SubjectResource::collection($subjects);
    }


    public function store(StoreSubjectRequest $request): SubjectResource
    {
        $subject = $this->subjectService->createSubject($request->validated());
        return new SubjectResource($subject);
    }


    public function show(int $id): SubjectResource
    {
        $subject = $this->subjectService->getSubjectId($id);
        return new SubjectResource($subject);
    }


    public function update(UpdateSubjectRequest $request, int $id): SubjectResource
    {
        $subject = $this->subjectService->getSubjectId($id);
        $subject = $this->subjectService->updateSubject($subject, $request->validated());

        return new SubjectResource($subject);
    }


    public function destroy(int $id): JsonResponse
    {
        $subject = $this->subjectService->getSubjectId($id);
        $this->subjectService->deleteSubject($subject);

        return response()->json([
            'message' => 'Tantárgy sikeresen törölve!'
        ]);
    }

    public function byTeacher(int $teacherId): AnonymousResourceCollection
    {
        $subjects = $this->subjectService->getSubjectByTeacher($teacherId);
        return SubjectResource::collection($subjects);
    }
}
