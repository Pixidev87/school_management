<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeeRequest;
use App\Http\Requests\UpdateFeeRequest;
use App\Http\Resources\FeeResource;
use App\Services\FeeService;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FeeController extends Controller
{
    public function __construct(
        private FeeService $feeService,
        private StudentService $studentService
    ) {}

    // Az összes díj listázása, lapozással..
    public function index(): AnonymousResourceCollection
    {
        $fee = $this->feeService->getAllFees();
        return FeeResource::collection($fee);
    }

    // Új díj létrehozása..
    public function store(StoreFeeRequest $request): FeeResource
    {
        $fee = $this->feeService->createFee($request->validated());
        return new FeeResource($fee);
    }

    // Egy díj lekérdezése...
    public function show(int $id): FeeResource
    {
        $fee = $this->feeService->getFeeById($id);
        return new FeeResource($fee);
    }

    // Egy díj adatainak a frissitése..
    public function update(UpdateFeeRequest $request, int $id): FeeResource
    {
        $fee = $this->feeService->getFeeById($id);
        $fee = $this->feeService->updateFee($fee, $request->validated());

        return new FeeResource($fee);
    }

    // Egy díj törlése.. (soft delete)
    public function destroy(int $id): JsonResponse
    {
        $fee = $this->feeService->getFeeById($id);
        $this->feeService->deleteFee($fee);

        return response()->json([
            'message' => 'Díj sikeresen törölve!'
        ]);
    }

    // Egy diák összes díjjának a lekérdezése..
    public function byStudent(int $studentId): AnonymousResourceCollection
    {
        $student = $this->studentService->getStudentById($studentId);
        $fees = $this->feeService->getStudentFee($student);

        return FeeResource::collection($fees);
    }

    // Összes lejárt, be nem fizetett díj
    public function overdue(): AnonymousResourceCollection
    {
        $fees = $this->feeService->getOverdueFees();
        return FeeResource::collection($fees);
    }

    // Díj befizetésének rögzítése.. azért nem sima update, mert extra logikája van a service-ben (bizonylat generálás, paid_date rögzités)
    public function pay(int $id): FeeResource
    {
        $fee = $this->feeService->getFeeById($id);
        $fee = $this->feeService->markAsPaid($fee);

        return new FeeResource($fee);
    }
}
