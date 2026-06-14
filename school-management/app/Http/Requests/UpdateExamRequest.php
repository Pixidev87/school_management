<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;


class UpdateExamRequest extends FormRequest
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
            'name'          => 'sometimes|required|string|max:255',
            'type'          => 'sometimes|required|in:midterm,final,quiz,assignment,practical',
            'class_id'      => 'sometimes|required|exists:classes,id',
            'subject_id'    => 'sometimes|required|exists:subjects,id',
            'exam_date'     => 'sometimes|required|date|date_format:Y-m-d',
            'start_time'    => 'nullable|date_format:H:i',
            'end_time'      => 'nullable|date_format:H:i|after:start_time',
            'total_marks'   => 'sometimes|required|integer|min:1',
            'passing_marks' => 'sometimes|required|integer|min:1',
            'room'          => 'nullable|string|max:100',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if ($this->filled('passing_marks')) {
                $exam = $this->route('exam');

                // Ha a kérésben jön total_marks, azt használjuk,
                // ha nem, az adatbázisban lévő értéket vesszük
                $totalMarks = $this->input('total_marks') ?? $exam->total_marks;

                if ($this->input('passing_marks') > $totalMarks) {
                    $validator->errors()->add(
                        'passing_marks',
                        'Az átmenő pontszám nem lehet nagyobb az elérhető pontnál (' . $totalMarks . ').'
                    );
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'name.required'       => 'A vizsga neve kötelező.',
            'type.required'       => 'A vizsga típusa kötelező.',
            'type.in'             => 'Érvényes típusok: midterm, final, quiz, assignment, practical.',
            'class_id.exists'     => 'A megadott osztály nem létezik.',
            'subject_id.exists'   => 'A megadott tantárgy nem létezik.',
            'exam_date.date_format' => 'A dátum formátuma: YYYY-MM-DD.',
            'end_time.after'      => 'A befejezési idő a kezdési idő után kell legyen.',
            'total_marks.min'     => 'Az elérhető pontszám minimum 1 kell legyen.',
            'passing_marks.min'   => 'Az átmenő pontszám minimum 1 kell legyen.',
        ];
    }
}
