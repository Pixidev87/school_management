<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectRequest extends FormRequest
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
            'code'          => 'required|string|max:50|unique:subjects,code',
            'total_periods' => 'nullable|integer|min:0',
            'teacher_id'    => 'nullable|exists:teacher,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'   => 'A tantárgy neve kötelező.',
            'code.required'   => 'A tantárgy kódja kötelező.',
            'code.unique'     => 'Ez a tantárgy kód már foglalt.',
            'teacher_id.exists' => 'A megadott tanár nem létezik.',
        ];
    }
}
