<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreFeeRequest extends FormRequest
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
            'student_id' => 'required|exists:student,id',
            'fee_type' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0|decimal:0,2',
            'due_date' => 'required|date|date_format:Y-m-d',
            'status' => 'nullable|in:pending,paid,overdue,waived',
            'note' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required' => 'A diák megadása kötelező.',
            'student_id.exists'   => 'A megadott diák nem létezik.',
            'fee_type.required'   => 'A díj típusa kötelező.',
            'amount.required'     => 'Az összeg megadása kötelező.',
            'amount.min'          => 'Az összeg nem lehet negatív.',
            'amount.decimal'      => 'Az összeg maximum 2 tizedesjegyet tartalmazhat.',
            'due_date.required'   => 'A határidő megadása kötelező.',
            'status.in'           => 'Érvényes státuszok: pending, paid, overdue, waived.',
        ];
    }
}
