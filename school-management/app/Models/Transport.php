<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transport extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'route_name',
        'vehicle_number',
        'driver_name',
        'driver_phone',
        'capacity',
    ];

    public function stops(): HasMany
    {
        return $this->hasMany(TransportStop::class)->orderBy('order');
    }

    public function students(): HasMany
    {
        return $this->hasMany(TransportStudent::class);
    }
}
