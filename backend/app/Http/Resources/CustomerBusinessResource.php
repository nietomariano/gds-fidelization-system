<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerBusinessResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "customer" => CustomerResource::make($this->whenLoaded('customer')),
            "customerId" => $this->when(!$this->relationLoaded('customer'), $this->customer_id),
            "businessId" => $this->business_id,
            "createdAt" => $this->created_at,
            "lastVisitAt" => $this->updated_at,
            "cachedPoints" => $this->cached_points
        ];
    }
}
