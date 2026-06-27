<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'name' => $this->name,
            'role' => $this->role,
            'is_admin' => $this->isAdmin(),
            'is_teacher' => $this->isTeacher(),
            'is_parent' => $this->isParent(),
            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}