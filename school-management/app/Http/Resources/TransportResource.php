<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'route_name' => $this->route_name,
            'vehicle_number' => $this->vehicle_number,
            'driver_name' => $this->driver_name,
            'driver_phone' => $this->driver_phone,
            'capacity' => $this->capacity,
            'stops_count' => $this->whenCounted('stops'),
            'students_count' => $this->whenCounted('students'),
            'stops' => $this->whenLoaded('stops', function () {
                return TransportStopResource::collection($this->stops);
            }),
            'students' => $this->whenLoaded('students', function () {
                return TransportStudentResource::collection($this->students);
            }),
            'is_full' => $this->when(
                isset($this->students_count),
                $this->students_count >= $this->capacity
            ),
        ];
    }
}
