<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuardianResource extends JsonResource
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
            'guardian_name' => $this->guardian_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'relationship' => $this->relationship,
            'student' => $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                ];
            }),
        ];
    }
}
