<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchoolClass extends Model
{
    use SoftDeletes;

    protected $table = 'classes'; // a tábla nevére kell hivatkozni mivel a model neve SchoolClass

    protected $fillable = [
        'name',
        'section',
        'room_number',
        'class_teacher_id'
    ];

    public function ClassTeacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'class_teacher_id'); // a tanár aki osztályfőnök, idegen kulcs a class_teacher_id mezőben
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id'); // a tanulók akik ebbe az osztályba járnak, idegen kulcs a class_id mezőben a students táblában
    }

    public function timetables(): HasMany
    {
        return $this->hasMany(Timetable::class, 'class_id'); // az órarendek amelyek ehhez az osztályhoz tartoznak, idegen kulcs a class_id mezőben a timetables táblában
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'class_id'); // a vizsgák amelyek ehhez az osztályhoz tartoznak, idegen kulcs a class_id mezőben az exams táblában
    }
}
