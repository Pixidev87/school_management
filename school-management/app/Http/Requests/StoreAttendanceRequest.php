<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Az attendances egy tömb – minden diák egy elem benne.
     * A Laravel array validációja így néz ki:
     *
     * 'attendances'              → a tömb maga kötelező
     * 'attendances.*'            → a tömb minden eleme
     * 'attendances.*.student_id' → minden elem student_id mezője
     *
     * Például ha frontend így küldi:
     * {
     *   "class_id": 1,
     *   "date": "2026-06-05",
     *   "attendances": [
     *     {"student_id": 1, "status": "present", "note": ""},
     *     {"student_id": 2, "status": "absent",  "note": "beteg"}
     *   ]
     * }
     */
    public function rules(): array
    {
        return [
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date|date_format:Y-m-d',
            'attendances' => 'required|array|min:1',
            'attendances.*.teacher_id' => 'required|exists:teachers,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.note' => 'nullable|string|max:255'
        ];
    }

    public function messages(): array
    {
        return [
            'class_id.required'              => 'Az osztály megadása kötelező.',
            'class_id.exists'                => 'A megadott osztály nem létezik.',
            'date.required'                  => 'A dátum megadása kötelező.',
            'date.date_format'               => 'A dátum formátuma: YYYY-MM-DD.',
            'attendances.required'           => 'Legalább egy jelenléti bejegyzés szükséges.',
            'attendances.*.student_id.exists' => 'Az egyik megadott diák nem létezik.',
            'attendances.*.status.required'  => 'Minden diáknál meg kell adni a státuszt.',
            'attendances.*.status.in'        => 'Érvényes státuszok: present, absent, late, excused.',
        ];
    }
}
