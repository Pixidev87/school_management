<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Library_book extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'category',
        'total_copies',
        'available_copies'
    ];

    public function libraryIssues(): HasMany
    {
        return $this->hasMany(Library_issues::class);
    }
}
