<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'marks_obtained' => $this->marks_obtained,
            'grade' => $this->grade,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'exam' => $this->whenLoaded('exam', function () {
                return [
                    'id' => $this->exam->id,
                    'name' => $this->exam->name,
                    'exam_date' => $this->exam->exam_date->format('Y-m-d'),
                    'total_marks' => $this->exam->total_marks,
                ];
            }),
            'student' => $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'roll_number' => $this->student->roll_number,
                ];
            }),
        ];
    }
}
