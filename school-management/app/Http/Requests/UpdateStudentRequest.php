<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
        // a sometimes azt jelenti itt, hogy akkor validálódik ha szerepel a kérésben..
        // az url-ből veszi ki az emailt, így nem kapunk hibát..
        $studentId = $this->route('student');

        return [
            'name'          => 'sometimes|string|max:255',
            'email'         => "sometimes|email|unique:students,email,{$studentId}",
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date|date_format:Y-m-d|before:today',
            'gender'        => 'nullable|in:male,female,other',
            'class_id'      => 'sometimes|required|exists:classes,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'A diák neve kötelező.',
            'email.required' => 'Az email cím kötelező.',
            'email.email'    => 'Érvényes email formátumot adj meg.',
            'email.unique'   => 'Ez az email cím már foglalt.',
            'class_id.exists' => 'A megadott osztály nem létezik.',
        ];
    }
}
