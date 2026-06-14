<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
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
            'email'         => 'required|email|unique:teachers,email',
            'phone'         => 'nullable|string|max:20',
            'qualification' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date|date_format:Y-m-d|before:today',
            'gender'        => 'nullable|in:male,female,other',
            'address'       => 'nullable|string|max:500',
            'joining_date'  => 'nullable|date|date_format:Y-m-d',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'A tanár neve kötelező.',
            'email.required' => 'Az email cím kötelező.',
            'email.email'    => 'Érvényes email formátumot adj meg.',
            'email.unique'   => 'Ez az email cím már foglalt.',
        ];
    }
}
