<?php

namespace App\Http\Controllers\Business;

use App\Http\Requests\Business\Settings\UpdateBusinessRequest;
use App\Http\Requests\Business\Settings\UpdateLoyaltyConfigRequest;
use Illuminate\Routing\Controller;
use App\Models\Business;
use App\Models\LoyaltyConfig;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller {
  
  public function getSettings(Request $request): JsonResponse {
    $user = $request->user()->load('business.loyaltyConfig');
    
    $business = $user->business;

    if (!$business) {
      throwAppError('No se encontró el negocio asociado al usuario', 404);
    }

    return successResponse('Configuración obtenida exitosamente', [
      'settings' => [
        'id' => $business->id,
        'name' => $business->name,
        'email' => $business->email,
        'phoneNumber' => $business->phone_number,
        'address' => $business->address,
        'profilePicture' => $business->profile_picture,
        'instagramUrl' => $business->instagram_url,
        'facebookUrl' => $business->facebook_url,
        'loyaltyConfig' => $business->loyaltyConfig ? [
          'id' => $business->loyaltyConfig->id,
          'baseAmount' => $business->loyaltyConfig->base_amount,
          'pointsAwarded' => $business->loyaltyConfig->points_awarded,
          'welcomeEnabled' => $business->loyaltyConfig->welcome_enabled,
          'welcomePoints' => $business->loyaltyConfig->welcome_points,
          'expirationEnabled' => $business->loyaltyConfig->expiration_enabled,
          'expirationDays' => $business->loyaltyConfig->expirationDays,
          'businessId' => $business->loyaltyConfig->business_id,
          'createdAt' => $business->loyaltyConfig->created_at,
          'updatedAt' => $business->loyaltyConfig->updated_at,
        ] : null,
        'createdAt' => $business->created_at,
        'updatedAt' => $business->updated_at,
      ]
    ]);
  }

  public function updateSettings(Request $request): JsonResponse {
    $user = $request->user();
    
    if (!$user->business_id) {
      throwAppError('Usuario no tiene un negocio asociado', 404);
    }

    DB::beginTransaction();
    
    try {
      $business = Business::findOrFail($user->business_id);
      
      // Actualizar Business si hay datos
      if ($request->has('name')) {
        $businessRequest = new UpdateBusinessRequest();
        $businessValidated = $request->validate($businessRequest->rules());
        
        $business->update([
          'name' => $businessValidated['name'],
          'email' => $businessValidated['email'] ?? $business->email,
          'phone_number' => $businessValidated['phone_number'] ?? $business->phone_number,
          'address' => $businessValidated['address'] ?? $business->address,
          'profile_picture' => $businessValidated['profile_picture'] ?? $business->profile_picture,
          'instagram_url' => $businessValidated['instagram_url'] ?? $business->instagram_url,
          'facebook_url' => $businessValidated['facebook_url'] ?? $business->facebook_url,
        ]);
      }

      // Actualizar o crear LoyaltyConfig si hay datos
      if ($request->hasAny(['base_amount', 'points_awarded', 'welcome_enabled', 'welcome_points', 'expiration_enabled', 'expiration_days'])) {
        $loyaltyRequest = new UpdateLoyaltyConfigRequest();
        $loyaltyValidated = $request->validate($loyaltyRequest->rules());
        
        $loyaltyConfig = LoyaltyConfig::updateOrCreate(
          ['business_id' => $business->id],
          [
            'base_amount' => $loyaltyValidated['base_amount'],
            'points_awarded' => $loyaltyValidated['points_awarded'],
            'welcome_enabled' => $loyaltyValidated['welcome_enabled'],
            'welcome_points' => $loyaltyValidated['welcome_points'],
            'expiration_enabled' => $loyaltyValidated['expiration_enabled'],
            'expirationDays' => $loyaltyValidated['expiration_days'],
          ]
        );
      }

      DB::commit();

      // Recargar relaciones
      $business->load('loyaltyConfig');

      return successResponse('Configuración actualizada exitosamente', [
        'settings' => [
          'id' => $business->id,
          'name' => $business->name,
          'email' => $business->email,
          'phoneNumber' => $business->phone_number,
          'address' => $business->address,
          'profilePicture' => $business->profile_picture,
          'instagramUrl' => $business->instagram_url,
          'facebookUrl' => $business->facebook_url,
          'loyaltyConfig' => $business->loyaltyConfig ? [
            'id' => $business->loyaltyConfig->id,
            'baseAmount' => $business->loyaltyConfig->base_amount,
            'pointsAwarded' => $business->loyaltyConfig->points_awarded,
            'welcomeEnabled' => $business->loyaltyConfig->welcome_enabled,
            'welcomePoints' => $business->loyaltyConfig->welcome_points,
            'expirationEnabled' => $business->loyaltyConfig->expiration_enabled,
            'expirationDays' => $business->loyaltyConfig->expirationDays,
            'businessId' => $business->loyaltyConfig->business_id,
            'createdAt' => $business->loyaltyConfig->created_at,
            'updatedAt' => $business->loyaltyConfig->updated_at,
          ] : null,
          'createdAt' => $business->created_at,
          'updatedAt' => $business->updated_at,
        ]
      ]);

    } catch (\Exception $e) {
      DB::rollBack();
      throwAppError('Error al actualizar la configuración: ' . $e->getMessage(), 500);
    }
  }
}