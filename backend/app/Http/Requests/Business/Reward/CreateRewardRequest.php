<?php

namespace App\Http\Requests\Business\Reward;

use Illuminate\Foundation\Http\FormRequest;

class CreateRewardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'cost' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.string'   => 'El nombre debe ser una cadena de texto.',
            'name.max'      => 'El nombre no debe superar los 100 caracteres.',
            'cost.required' => 'El costo del premio es obligatorio.',
            'cost.integer'  => 'El costo debe ser un número entero.',
            'cost.min'      => 'El costo debe ser al menos 1.',
        ];
    }
}
