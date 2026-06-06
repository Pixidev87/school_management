<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification_read extends Model
{
    protected $fillable = [
        'read_at',
        'notification_id',
        'user_id'
    ];

    protected $casts = [
        'read_at' => 'datetime'
    ];

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
