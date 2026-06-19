<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
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
            'date' => $this->date->format('Y-m-d'),
            'status' => $this->status,
            'note' => $this->note,
            'student' => $this->whenLoaded('student', function () {
                return $this->student ? [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                ] : null;
            }),
            'teacher' => $this->whenLoaded('teacher', function () {
                return $this->teacher ? [
                    'id' => $this->teacher->id,
                    'name' => $this->teacher->name,
                ] : null;
            }),
            'school_class' => $this->whenLoaded('schoolClass', function () {
                return [
                    'id' => $this->schoolClass->id,
                    'name' => $this->schoolClass->name,
                ];
            }),
        ];
    }
}
