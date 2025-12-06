<?php

namespace App\Http\Requests\Business\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoyaltyConfigRequest extends FormRequest {
    public function rules(): array {
        return [
            'base_amount' => 'required|numeric|min:0',
            'points_awarded' => 'required|numeric|min:0',
            'welcome_enabled' => 'required|boolean',
            'welcome_points' => 'required|integer|min:0',
            'expiration_enabled' => 'required|boolean',
            'expiration_days' => 'required|integer|min:1',
        ];
    }

    public function messages(): array {
        return [
            'base_amount.required' => 'El monto base es obligatorio.',
            'base_amount.numeric' => 'El monto base debe ser un número.',
            'base_amount.min' => 'El monto base no puede ser negativo.',
            'points_awarded.required' => 'Los puntos otorgados son obligatorios.',
            'points_awarded.numeric' => 'Los puntos otorgados deben ser un número.',
            'points_awarded.min' => 'Los puntos otorgados no pueden ser negativos.',
            'welcome_enabled.required' => 'El campo de puntos de bienvenida habilitados es obligatorio.',
            'welcome_enabled.boolean' => 'El campo de puntos de bienvenida habilitados debe ser verdadero o falso.',
            'welcome_points.required' => 'Los puntos de bienvenida son obligatorios.',
            'welcome_points.integer' => 'Los puntos de bienvenida deben ser un número entero.',
            'welcome_points.min' => 'Los puntos de bienvenida no pueden ser negativos.',
            'expiration_enabled.required' => 'El campo de expiración habilitada es obligatorio.',
            'expiration_enabled.boolean' => 'El campo de expiración habilitada debe ser verdadero o falso.',
            'expiration_days.required' => 'Los días de expiración son obligatorios.',
            'expiration_days.integer' => 'Los días de expiración deben ser un número entero.',
            'expiration_days.min' => 'Los días de expiración deben ser al menos 1.',
        ];
    }
}
