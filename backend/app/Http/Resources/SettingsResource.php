<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingsResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phoneNumber' => $this->phone_number,
            'address' => $this->address,
            'profilePicture' => $this->profile_picture,
            'instagramUrl' => $this->instagram_url,
            'facebookUrl' => $this->facebook_url,
            'loyaltyConfig' => $this->loyaltyConfig ? new LoyaltyConfigResource($this->loyaltyConfig) : null,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
