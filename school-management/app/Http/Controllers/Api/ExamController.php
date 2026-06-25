<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\StoreExamResultRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Http\Resources\ExamResource;
use App\Http\Resources\ExamResultResource;
use App\Services\ExamService;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExamController extends Controller
{

    public function __construct(
        private ExamService $examService,
        private StudentService $studentService
    ) {}

    // Az összes vizgsa listázása lapozással..
    public function index(): AnonymousResourceCollection
    {
        $exams = $this->examService->getAllExams();
        return ExamResource::collection($exams);
    }

    // Új vizsga létrehozása..
    public function store(StoreExamRequest $request): ExamResource
    {
        $exam = $this->examService->createExam($request->validated());
        return new ExamResource($exam);
    }

    // Egy vizsga az összes adatával és eredményeivel..
    public function show(int $id): ExamResource
    {
        $exam = $this->examService->getExamById($id);
        return new ExamResource($exam);
    }

    // Egy vizsga adatainak a frissitése..
    public function update(UpdateExamRequest $request, int $id): ExamResource
    {
        $exam = $this->examService->getExamById($id);
        $exam = $this->examService->updateExam($exam, $request->validated());

        return new ExamResource($exam);
    }

    // Egy vizsga törlése (soft delete)
    public function destroy(int $id): JsonResponse
    {
        $exam = $this->examService->getExamById($id);
        $this->examService->deleteExam($exam);

        return response()->json([
            'message' => 'Vizsga sikeresen törölve!'
        ]);
    }

    // Vizsgaeredmények tömeges rögzítése..
    public function storeResults(StoreExamResultRequest $request, int $id): JsonResponse
    {
        $exam = $this->examService->getExamById($id);

        $this->examService->recordResults(
            $exam,
            $request->input('results')
        );

        return response()->json([
            'message' => 'Vizsgaeredmények sikeresen rögzítve!'
        ]);
    }

    // Egy vizsga statisztikái..
    public function statistics(int $id): JsonResponse
    {
        $exam = $this->examService->getExamById($id);
        $stats = $this->examService->getExamStatistics($exam);

        return response()->json([
            'data' => $stats
        ]);
    }

    // Egy diák összess vizsgaeredménye..
    public function studentResults(int $studentId): AnonymousResourceCollection
    {
        $student = $this->studentService->getStudentById($studentId);
        $results = $this->examService->getStudentResults($student);

        return ExamResultResource::collection($results);
    }
}
