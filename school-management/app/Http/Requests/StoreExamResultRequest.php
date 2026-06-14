<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExamResultRequest extends FormRequest
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
        // itt is tömeges eredményrögzítés van, ezért van az array validáció
        return [
            'results'                   => 'required|array|min:1',
            'results.*.student_id'      => 'required|exists:students,id',
            'results.*.marks_obtained'  => 'required|integer|min:0',
            'resuéts.*.remarks'         => 'nullable|string|max:500',
        ];

        // a grade és status mezőt/oszlopot az ExamService-ben számoljuk ki, ezt nem a frontend küldi, ezáltal nem kell ellenőrizni..
    }

    public function messages(): array
    {
        return [
            'results.required'                  => 'Legalább egy eredmény megadása kötelező.',
            'results.*.student_id.required'     => 'Minden eredménynél meg kell adni a diákot.',
            'results.*.student_id.exists'       => 'Az egyik megadott diák nem létezik.',
            'results.*.marks_obtained.required' => 'Minden diáknál meg kell adni a pontszámot.',
            'results.*.marks_obtained.min'      => 'A pontszám nem lehet negatív.',
        ];
    }
}
