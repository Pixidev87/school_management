<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IssueLibraryBookRequest extends FormRequest
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
            'student_id' => 'nullable|exists:students,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'due_date'   => 'required|date|date_format:Y-m-d|after:today',
            //due_date a mai napnál később kell legyen, visszadátumozni igy nem lehet.
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $hasStudent = $this->filled('student_id');
            $hasTeacher = $this->filled('teacher_id');

            if (!$hasStudent && !$hasTeacher) {
                $validator->errors()->add('student_id', 'Legalább egy diákot vagy tanárt meg kell adni.');
                $validator->errors()->add('teacher_id', 'Legalább egy diákot vagy tanárt meg kell adni.');
            }

            if ($hasStudent && $hasTeacher) {
                $validator->errors()->add('student_id', 'Csak diákot vagy tanárt lehet megadni, nem mindkettőt.');
                $validator->errors()->add('teacher_id', 'Csak diákot vagy tanárt lehet megadni, nem mindkettőt.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'due_date.required' => 'A visszahozási határidő megadása kötelező.',
            'due_date.after'    => 'A határidő csak jövőbeli dátum lehet.',
            'student_id.exists' => 'A megadott diák nem létezik.',
            'teacher_id.exists' => 'A megadott tanár nem létezik.',
        ];
    }
}
