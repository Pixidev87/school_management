<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Library_issues extends Model
{
    protected $fillable = [
        'issues_date',
        'due_date',
        'return_date',
        'fine',
        'status',
        'book_id',
        'student_id',
        'teacher_id'
    ];

    protected $casts = [
        'issues_date' => 'date',
        'due_date' => 'date',
        'return_date' => 'date',
        'fine' => 'decimal:2'
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Library_book::class, 'book_id');
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
