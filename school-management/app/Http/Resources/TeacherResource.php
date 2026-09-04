<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'qualification' => $this->qualification,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'address' => $this->address,
            'joining_date' => $this->joining_date?->format('Y-m-d'),
            'subjects' => $this->whenLoaded('subjects', function () {
                return SubjectResource::collection($this->subjects);
            }),
            'classes' => $this->whenLoaded('classes', function () {
                return SchoolClassResource::collection($this->classes);
            }),
            'timetables' => $this->whenLoaded('timetables', function () {
                return TimetableResource::collection($this->timetables);
            }),
            'created_at' => $this->created_at?->format('Y-m-d'),
        ];
    }
}
