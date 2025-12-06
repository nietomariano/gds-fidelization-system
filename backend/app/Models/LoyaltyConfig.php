<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string|null $base_amount
 * @property string|null $points_awarded
 * @property int|null $welcome_enabled
 * @property int|null $welcome_points
 * @property int|null $expiration_enabled
 * @property int|null $expirationDays
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $business_id
 * @property-read \App\Models\Business $business
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereBaseAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereBusinessId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereExpirationDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereExpirationEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig wherePointsAwarded($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereWelcomeEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoyaltyConfig whereWelcomePoints($value)
 * @mixin \Eloquent
 */
class LoyaltyConfig extends Model
{
    use HasUuids;

    protected $fillable = [
        'business_id', 'base_amount', 'points_awarded',
        'welcome_enabled', 'welcome_points',
        'expiration_enabled', 'expirationDays'
    ];

    public function business(): BelongsTo {
        return $this->belongsTo(Business::class);
    }
}
