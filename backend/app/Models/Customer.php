<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property string $id
 * @property string $name
 * @property string $phone_number
 * @property string|null $profile_picture
 * @property string|null $email
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Business> $businesses
 * @property-read int|null $businesses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PointsLedger> $pointsLedger
 * @property-read int|null $points_ledger_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Purchase> $purchases
 * @property-read int|null $purchases_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Redeem> $redeems
 * @property-read int|null $redeems_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer whereProfilePicture($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Customer whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Customer extends Authenticatable
{
    use HasUuids;
    use SoftDeletes;
    use HasApiTokens;

    protected $fillable = ['first_name', 'last_name', 'phone_number', 'phone_validated_at', 'profile_picture', 'email', 'password'];
    
    protected $hidden = ['password'];

    public function businesses(): BelongsToMany {
        return $this->belongsToMany(Business::class, 'customer_business')
                    ->withPivot('cached_points')
                    ->withTimestamps();
    }

    public function purchases(): HasMany {
        return $this->hasMany(Purchase::class);
    }

    public function redeems(): HasMany {
        return $this->hasMany(Redeem::class);
    }

    public function pointsLedger(): HasMany {
        return $this->hasMany(PointsLedger::class);
    }

    /**
     * Check if the customer's phone number has been validated
     * 
     * If the customer is validated it means that the customer itself has registered
     * into the application.
     */
    public function isAlreadyValidated(): bool {
        return !is_null($this->phone_validated_at);
    }
}
