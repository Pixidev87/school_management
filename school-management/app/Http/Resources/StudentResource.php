<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'address' => $this->address,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'roll_number' => $this->roll_number,

            //Azért resource-t adunk vissza mert lehet több adatra is szükség és nem csak egyre.. A resource gondoskodik a formázásról..
            'school_class' => $this->whenLoaded('schoolClass', function () {
                return new SchoolClassResource($this->schoolClass);
            }),

            //A guardians lista akkor jelenik meg ha betöltöttük pl a getStudentById()-nál..
            'guardians' => $this->whenLoaded('guardians', function () {
                return GuardianResource::collection($this->guardians);
            }),
            'examResults' => $this->whenLoaded('examResults', function () {
                return ExamResultResource::collection($this->examResults);
            }),
            'fees' => $this->whenLoaded('fees', function () {
                return FeeResource::collection($this->fees);
            }),
            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
