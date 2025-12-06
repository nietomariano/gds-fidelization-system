<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoyaltyConfigResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'baseAmount' => $this->base_amount,
            'pointsAwarded' => $this->points_awarded,
            'welcomeEnabled' => $this->welcome_enabled,
            'welcomePoints' => $this->welcome_points,
            'expirationEnabled' => $this->expiration_enabled,
            'expirationDays' => $this->expirationDays,
            'businessId' => $this->business_id,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
