<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherRequest extends FormRequest
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
        $teacherId = $this->route('teacher');

        return [
            'name'          => 'sometimes|string|max:255',
            'email'         => "sometimes|email|unique:teachers,email,{$teacherId}",
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
            'email.unique'   => 'Ez az email cím már foglalt.',
        ];
    }
}
