<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportStudent extends Model
{
    protected $fillable = [
        'transport_id',
        'student_id',
        'stop_id',
    ];

    public function transport(): BelongsTo
    {
        return $this->belongsTo(Transport::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function stop(): BelongsTo
    {
        return $this->belongsTo(TransportStop::class, 'stop_id');
    }
}
