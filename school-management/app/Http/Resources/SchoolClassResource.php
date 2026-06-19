<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolClassResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //A class_teacher kapcsolat akkor jelenik meg ha be van töltve eager loadinggal.
        //A students_count akkor jelenik meg, ha lekérdezésnél a withCount('students')-et használtunk. when() ellenőrzi hogy létezik-e az attribútum.
        return [
            'id' => $this->id,
            'name' => $this->name,
            'section' => $this->section,
            'room_number' => $this->room_number,
            'class_teacher' => $this->whenLoaded('classTeacher', function () {
                return [
                    'id' => $this->classTeacher->id,
                    'name' => $this->classTeacher->name,
                ];
            }),
            'student_count' => $this->when(
                isset($this->students_count),
                $this->students_count
            ),

        ];
    }
}
