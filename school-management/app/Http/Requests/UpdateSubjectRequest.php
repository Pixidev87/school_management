<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSubjectRequest extends FormRequest
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
        $subjectId = $this->route('subject');

        return [
            'name'          => 'sometimes|string|max:255',
            'code'          => "sometimes|string|max:50|unique:subjects,code,{$subjectId}",
            'total_periods' => 'nullable|integer|min:0',
            'teacher_id'    => 'nullable|exists:teachers,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'A tantárgy neve kötelező.',
            'code.required'     => 'A tantárgy kódja kötelező.',
            'code.unique'       => 'Ez a tantárgy kód már foglalt.',
            'teacher_id.exists' => 'A megadott tanár nem létezik.',
        ];
    }
}
