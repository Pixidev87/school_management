<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryIssue extends Model
{
    protected $fillable = [
        'book_id',
        'student_id',
        'teacher_id',
        'issue_date',
        'due_date',
        'return_date',
        'fine',
        'status',
    ];

    protected $casts = [
        'issue_date'  => 'date',
        'due_date'    => 'date',
        'return_date' => 'date',
        'fine'        => 'decimal:2',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(LibraryBook::class, 'book_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
