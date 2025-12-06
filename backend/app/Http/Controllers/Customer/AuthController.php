<?php

namespace App\Http\Controllers\Customer;

use App\Http\Requests\Customer\Auth\LoginRequest;
use App\Http\Requests\Customer\Auth\RegisterRequest;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register a new customer
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $phone_number = phone($validated['phone_number'], 'AR', 'INTERNATIONAL');
        
        // Check if customer already exists
        $existingCustomer = Customer::wherePhoneNumber($phone_number)->first();
        
        if ($existingCustomer) {
            if ($existingCustomer->isAlreadyValidated()) {
                return errorResponse('Ya existe una cuenta con este número de teléfono', 409);
            }
            
            // Customer was created by a business but never registered themselves
            $existingCustomer->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'] ?? null,
                'email' => $validated['email'] ?? null,
                'password' => Hash::make($validated['password']),
                'phone_validated_at' => now(),
            ]);
            
            $token = $existingCustomer->createToken('customer-token')->plainTextToken;
            
            return successResponse('Registro completado exitosamente', [
                'customer' => $existingCustomer,
                'token' => $token,
            ], 201);
        }
        
        // Create new customer
        $customer = Customer::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone_number' => $phone_number,
            'password' => Hash::make($validated['password']),
            'phone_validated_at' => now(),
        ]);
        
        $token = $customer->createToken('customer-token')->plainTextToken;
        
        return successResponse('Registro exitoso', [
            'customer' => $customer,
            'token' => $token,
        ], 201);
    }
    
    /**
     * Login a customer
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $phone_number = phone($validated['phone_number'], 'AR', 'INTERNATIONAL');
        
        $customer = Customer::wherePhoneNumber($phone_number)->first();
        
        if (!$customer || !$customer->isAlreadyValidated()) {
            return errorResponse('No existe una cuenta con este número de teléfono', 404);
        }
        
        if (!Hash::check($validated['password'], $customer->password)) {
            return errorResponse('Contraseña incorrecta', 401);
        }
        
        $token = $customer->createToken('customer-token')->plainTextToken;
        
        return successResponse('Login exitoso', [
            'customer' => $customer,
            'token' => $token,
        ]);
    }
    
    /**
     * Get authenticated customer data
     */
    public function me(Request $request): JsonResponse
    {
        $customer = $request->user();
        
        return successResponse('Cliente autenticado', [
            'customer' => $customer,
        ]);
    }
    
    /**
     * Logout customer
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        
        return successResponse('Logout exitoso');
    }
}
