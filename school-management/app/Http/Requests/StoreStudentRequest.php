<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class StoreStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:students,email', // Az email egyedi kell legyen a students táblában.
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date|date_format:Y-m-d|before:today',  // A date_format ellenőrzi hogy a dátum YYYY-MM-DD formátumú-e
            'gender'        => 'nullable|in:male,femala,other',
            'class_id'      => 'required|exists:classes,id', // Ellenőrzi, hogy a megadott class_id létezik-e a classes táblában.
        ];
    }

    #[Override]
    public function messages(): array
    {
        return [
            'name.required'          => 'A diák neve kötelező.',
            'name.max'               => 'A név maximum 255 karakter lehet.',
            'email.required'         => 'Az email cím kötelező.',
            'email.email'            => 'Érvényes email formátumot adj meg.',
            'email.unique'           => 'Ez az email cím már foglalt.',
            'date_of_birth.before'   => 'A születési dátum nem lehet jövőbeli.',
            'date_of_birth.date_format' => 'A dátum formátuma: YYYY-MM-DD.',
            'gender.in'              => 'A nem értéke csak male, female vagy other lehet.',
            'class_id.required'      => 'Az osztály megadása kötelező.',
            'class_id.exists'        => 'A megadott osztály nem létezik.',
        ];
    }
}
