<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportStudentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'transport_id' => $this->transport_id,
            'student_id' => $this->student_id,
            'stop_id' => $this->stop_id,
            'student' => $this->whenLoaded('student', function () {
                return $this->student ? [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'roll_number' => $this->student->roll_number,
                ] : null;
            }),
            'stop' => $this->whenLoaded('stop', function () {
                return $this->stop ? [
                    'id' => $this->stop->id,
                    'stop_name' => $this->stop->stop_name,
                ] : null;
            }),
        ];
    }
}
