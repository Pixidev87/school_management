<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transport_stops extends Model
{
    protected $fillable = [
        'stop_name',
        'pickup_time',
        'drop_time',
        'order',
        'transport_id'
    ];

    protected $casts = [
        'pickup_time' => 'datetime:H:i',
        'drop_time' => 'datetime:H:i'
    ];

    public function transport(): BelongsTo
    {
        return $this->belongsTo(Transport::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Transport_students::class, 'stop_id');
    }
}
