<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RewardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"         => $this->id,
            "name"       => $this->name,
            "cost"       => $this->cost,
            "businessId" => $this->business_id,
            "createdAt"  => $this->created_at,
            "updatedAt"  => $this->updated_at,
        ];
    }
}
