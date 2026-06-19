<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryIssueResource extends JsonResource
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
            'issues_date' => $this->issues_date->format('Y-m-d'),
            'due_date' => $this->due_date->format('Y-m-d'),
            'return_date' => $this->return_date?->format('Y-m-d'),
            'fine' => number_format($this->fine, 2, '.', ''),
            'status' => $this->status,
            'book' => $this->whenLoaded('book', function () {
                return [
                    'id' => $this->book->id,
                    'name' => $this->book->name,
                    'isbn' => $this->book->isbn,
                ];
            }),
            'student' => $this->whenLoaded('student', function () {
                return $this->student ? [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                ] : null;
            }),
            'teacher' => $this->whenLoaded('teacher', function () {
                return $this->teacher ? [
                    'id' => $this->teacher->id,
                    'name' => $this->teacher->name,
                ] : null;
            }),

            // akkor true- ha még nincs visszahozva a könyv és a határidő lejárt..
            'is_overdue' => $this->status === 'issued' && $this->due_date->isPast(),
        ];
    }
}
