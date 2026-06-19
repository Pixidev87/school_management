<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'      => $this->id,
            'title'   => $this->title,
            'message' => $this->message,
            'type'    => $this->type,
            'target'  => $this->target,
            'channel' => $this->channel,
            'sent_at' => $this->sent_at?->format('Y-m-d H:i'),

            'creator' => $this->whenLoaded('creator', function () {
                return [
                    'id'   => $this->creator->id,
                    'name' => $this->creator->name,
                ];
            }),

            // ezt a mezőt a controller adja majd opcionálisan.. Ehhez tudnunk kell ki a bejelentkezett felhasználó..
            'reads_count' => $this->when(
                isset($this->reads_count),
                $this->reads_count
            ),
        ];
    }
}
