<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryBookResource extends JsonResource
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
            'title' => $this->title,
            'author' => $this->author,
            'isbn' => $this->isbn,
            'category' => $this->category,
            'total_copies' => $this->total_copies,
            'available_copies' => $this->available_copies,
            'issues' => $this->whenLoaded('libraryIssues', function () {
                return LibraryIssueResource::collection($this->issues);
            }),

            //számitott mező itt.. A frontend jelezheti a felhasználónak, hogy kölcsönözhető-e a könyv egy boolean értékkel..
            'is_available' => $this->available_copies > 0,
        ];
    }
}
