<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationRequest extends FormRequest
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
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'required|in:notice,announcement,reminder,alert',
            'target'  => 'required|in:all,students,teachers,parents',
            'channel' => 'required|in:app,email,sms',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'   => 'Az értesítés címe kötelező.',
            'message.required' => 'Az értesítés szövege kötelező.',
            'type.required'    => 'Az értesítés típusa kötelező.',
            'type.in'          => 'Érvényes típusok: notice, announcement, reminder, alert.',
            'target.required'  => 'A célcsoport megadása kötelező.',
            'target.in'        => 'Érvényes célcsoportok: all, students, teachers, parents.',
            'channel.required' => 'A küldési csatorna megadása kötelező.',
            'channel.in'       => 'Érvényes csatornák: app, email, sms.',
        ];
    }
}
