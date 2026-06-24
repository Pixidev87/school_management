<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'class_id'   => 'required|exists:classes,id',
            'date'       => 'required|date|date_format:Y-m-d',

            'attendances'              => 'required|array|min:1',
            'attendances.*.teacher_id' => 'required|exists:teachers,id',
            'attendances.*.status'     => 'required|in:present,absent,late,excused',
            'attendances.*.note'       => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'class_id.required'              => 'Az osztály megadása kötelező.',
            'date.required'                  => 'A dátum megadása kötelező.',
            'attendances.required'           => 'Legalább egy jelenléti bejegyzés szükséges.',
            'attendances.*.teacher_id.exists' => 'Az egyik megadott tanár nem létezik.',
            'attendances.*.status.required'  => 'Minden tanárnál meg kell adni a státuszt.',
            'attendances.*.status.in'        => 'Érvényes státuszok: present, absent, late, excused.',
        ];
    }
}
