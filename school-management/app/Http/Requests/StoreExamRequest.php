<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
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
            'type'          => 'required|in:midterm,final,quiz,assignment,practical',
            'class_id'      => 'required|exists:classes,id',
            'subject_id'    => 'required|exists:subjects,id',
            'exam_date'     => 'required|date|date_format:Y-m-d',
            'start_time'    => 'nullable|date_format:H:i',
            'end_time'      => 'nullable|date_format:H:i|after:start_time',
            'total_marks'   => 'required|integer|min:1',
            'room'          => 'nullable|string|max:100',
            'passing_marks' => 'required|integer|min:1|lte:total_marks',
            /**
         * A passing_marks nem lehet nagyobb mint a total_marks.
         * Az 'lte' szabály: less than or equal to (kisebb vagy egyenlő).
         * A 'total_marks' értékét veszi referenciaként.
         */

        ];
    }

    public function messages(): array
    {
        return [
            'name.required'          => 'A vizsga neve kötelező.',
            'type.required'          => 'A vizsga típusa kötelező.',
            'type.in'                => 'Érvényes típusok: midterm, final, quiz, assignment, practical.',
            'class_id.required'      => 'Az osztály megadása kötelező.',
            'subject_id.required'    => 'A tantárgy megadása kötelező.',
            'exam_date.required'     => 'A vizsga dátuma kötelező.',
            'end_time.after'         => 'A befejezési idő a kezdési idő után kell legyen.',
            'total_marks.required'   => 'Az elérhető pontszám kötelező.',
            'passing_marks.lte'      => 'Az átmenő pontszám nem lehet nagyobb az elérhető pontnál.',
        ];
    }
}
