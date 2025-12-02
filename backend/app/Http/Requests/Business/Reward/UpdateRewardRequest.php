<?php

namespace App\Http\Requests\Business\Reward;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRewardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:100',
            'cost' => 'sometimes|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string'   => 'El nombre debe ser una cadena de texto.',
            'name.max'      => 'El nombre no debe superar los 100 caracteres.',
            'cost.integer'  => 'El costo debe ser un número entero.',
            'cost.min'      => 'El costo debe ser al menos 1.',
        ];
    }
}
