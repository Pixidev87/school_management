<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreLibraryBookRequest extends FormRequest
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
            'title'            => 'required|string|max:255',
            'author'           => 'nullable|string|max:255',
            'isbn'             => 'nullable|string|max:20|unique:library_books,isbn',
            'category'         => 'nullable|string|max:100',
            'total_copies'     => 'required|integer|min:1',
            'available_copies' => 'required|integer|min:0|lte:total_copies',
            //Az available_copies nem lehet nagyobb mint a total_copies. A total_copies-t veszi referenciaként.
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'              => 'A könyv címe kötelező.',
            'total_copies.required'       => 'A példányszám megadása kötelező.',
            'total_copies.min'            => 'Legalább 1 példánynak kell lennie.',
            'available_copies.lte'        => 'Az elérhető példányok száma nem haladhatja meg az összes példányét.',
            'isbn.unique'                 => 'Ez az ISBN már szerepel a rendszerben.',
        ];
    }
}
