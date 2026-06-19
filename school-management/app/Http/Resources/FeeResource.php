<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeeResource extends JsonResource
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
            'fee_type' => $this->fee_type,
            'amount' => number_format($this->amount, 2, '.', ''),
            'due_date' => $this->due_date->format('Y-m-d'),
            'paid_date' => $this->paid_date?->format('Y-m-d'),
            'status' => $this->status,
            'receipt_number' => $this->receipt_number,
            'note' => $this->note,
            'student' => $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'roll_number' => $this->student->roll_number,
                ];
            }),
            // az is_overdue egy számitott mező, nem adatbázisból jön.. mivel a modellben beállitottam $casts-t igy a due_date egy Carbon objektum aminek van egy ilyen metódusa: isPast()
            'is_overdue' => $this->status === 'pending' && $this->due_date->isPast(),
        ];
    }
}
