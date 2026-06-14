<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFeeRequest extends FormRequest
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
            'fee_type' => 'sometimes|string|max:100',
            'amount'   => 'sometimes|numeric|min:0|decimal:0,2',
            'due_date' => 'sometimes|required|date|date_format:Y-m-d',
            'status'   => 'nullable|in:pending,paid,overdue,waived',
            'note'     => 'nullable|string|max:500',
        ];
    }
}
