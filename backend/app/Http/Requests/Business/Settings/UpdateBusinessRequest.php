<?php

namespace App\Http\Requests\Business\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessRequest extends FormRequest {
    public function rules(): array {
        return [
            'name' => 'required|string|max:100',
            'email' => 'nullable|email|max:200',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:150',
            'profile_picture' => 'nullable|string|max:500000', // Aumentado para base64 images
            'instagram_url' => 'nullable|string|max:255',
            'facebook_url' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array {
        return [
            'name.required' => 'El nombre del negocio es obligatorio.',
            'name.max' => 'El nombre no debe superar los 100 caracteres.',
            'email.email' => 'El email no tiene un formato válido.',
            'email.max' => 'El email no debe superar los 200 caracteres.',
            'phone_number.max' => 'El número de teléfono no debe superar los 20 caracteres.',
            'address.max' => 'La dirección no debe superar los 150 caracteres.',
            'profile_picture.max' => 'La URL de la imagen de perfil no debe superar los 255 caracteres.',
            'instagram_url.url' => 'La URL de Instagram no tiene un formato válido.',
            'instagram_url.max' => 'La URL de Instagram no debe superar los 255 caracteres.',
            'facebook_url.url' => 'La URL de Facebook no tiene un formato válido.',
            'facebook_url.max' => 'La URL de Facebook no debe superar los 255 caracteres.',
        ];
    }
}
