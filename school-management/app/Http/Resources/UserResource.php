<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'name' => $this->name,
            'role' => $this->role,
            'is_admin' => $this->isAdmin(),
            'is_teacher' => $this->isTeacher(),
            'is_parent' => $this->isParent(),
            'teacher' => $this->whenLoaded('teacher', function () {
                return $this->teacher ? [
                    'id'            => $this->teacher->id,
                    'name'          => $this->teacher->name,
                    'qualification' => $this->teacher->qualification,
                ] : null;
            }),

            'student' => $this->whenLoaded('student', function () {
                return $this->student ? [
                    'id'          => $this->student->id,
                    'name'        => $this->student->name,
                    'roll_number' => $this->student->roll_number,
                ] : null;
            }),

            'guardian' => $this->whenLoaded('guardian', function () {
                return $this->guardian ? [
                    'id'            => $this->guardian->id,
                    'guardian_name' => $this->guardian->guardian_name,
                    'student_id'    => $this->guardian->student_id,
                ] : null;
            }),

            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
