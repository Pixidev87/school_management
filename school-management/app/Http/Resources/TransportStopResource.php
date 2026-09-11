<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportStopResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stop_name' => $this->stop_name,
            'pickup_time' => $this->pickup_time?->format('H:i'),
            'drop_time' => $this->drop_time?->format('H:i'),
            'order' => $this->order,
            'transport' => $this->whenLoaded('transport', function () {
                return [
                    'id' => $this->transport->id,
                    'route_name' => $this->transport->route_name,
                ];
            }),
        ];
    }
}
