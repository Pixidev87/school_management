<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\TransportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    // Diákok..
    Route::apiResource('students', StudentController::class);

    // Tanárok..
    // Tanárok napi beosztás lekérdezése..
    Route::apiResource('teachers', TeacherController::class);
    Route::get('teachers/{id}/schedule', [TeacherController::class, 'schedule'])->name('teachers.schedule');

    // Osztályok..
    // Osztály diákjainak a listázása..
    Route::apiResource('classes', SchoolClassController::class);
    Route::get('classes/{id}/students', [SchoolClassController::class, 'students'])->name('classes.students');

    // Tantárgyak..
    // Tantárgyak egy tanárhoz..
    Route::apiResource('subjects', SubjectController::class);
    Route::get('subjects/teacher/{teacherId}', [SubjectController::class, 'byTeacher'])->name('subjects.by-teacher');

    // Jelenlétek..
    Route::prefix('attendances')->name('attendances.')->group(function () {
        Route::post('students', [AttendanceController::class, 'storeStudents'])->name('students.store');
        Route::post('teachers', [AttendanceController::class, 'storeTeachers'])->name('teachers.store');
        Route::get('class/{classId}', [AttendanceController::class, 'byClass'])->name('class.index');
        Route::get('class/{classId}/history', [AttendanceController::class, 'classHistory'])->name('class.history');
        Route::get('student/{studentId}', [AttendanceController::class, 'studentStats'])->name('student.stats');
    });

    // Órarend..
    Route::prefix('timetables')->name('timetables.')->group(function () {
        Route::get('class/{classId}', [TimetableController::class, 'byClass'])->name('class.index');
        Route::get('class/{classId}/day', [TimetableController::class, 'byClassAndDay'])->name('class.day');
        Route::post('/', [TimetableController::class, 'store'])->name('store');
        Route::put('{id}', [TimetableController::class, 'update'])->name('update');
        Route::delete('{id}', [TimetableController::class, 'destroy'])->name('destroy');
    });

    // Vizsgák..
    Route::apiResource('exams', ExamController::class);

    Route::prefix('exams')->name('exams.')->group(function () {
        Route::post('{id}/results', [ExamController::class, 'storeResults'])->name('results.store');
        Route::get('{id}/statistics', [ExamController::class, 'statistics'])->name('statistics');
        Route::get('student/{studentId}/results', [ExamController::class, 'studentResults'])->name('student.results');
    });

    // Díjjak..
    Route::apiResource('fees', FeeController::class);

    Route::prefix('fees')->name('fees.')->group(function () {
        Route::get('student/{studentId}', [FeeController::class, 'byStudent'])->name('student.index');
        Route::get('overdue/list', [FeeController::class, 'overdue'])->name('overdue');
        Route::post('{id}/pay', [FeeController::class, 'pay'])->name('pay');
    });

    // Könyvtár..
    Route::prefix('library')->name('library.')->group(function () {

        // Könyvek..
        Route::prefix('books')->name('books.')->group(function () {
            Route::get('/', [LibraryController::class, 'index'])->name('index');
            Route::post('/', [LibraryController::class, 'store'])->name('store');
            Route::get('{id}', [LibraryController::class, 'show'])->name('show');
            Route::put('{id}', [LibraryController::class, 'update'])->name('update');
            Route::delete('{id}', [LibraryController::class, 'destroy'])->name('destroy');

            // Könyv kölcsönzése..
            Route::post('{id}/issue', [LibraryController::class, 'issue'])->name('issue');
        });

        // Kölcsönzések..
        Route::prefix('issues')->name('issues.')->group(function () {
            Route::get('active', [LibraryController::class, 'activeIssues'])->name('active');
            Route::get('overdue', [LibraryController::class, 'overdueIssues'])->name('overdue');

            // Könyv visszahozásának rögzítése..
            Route::post('{id}/return', [LibraryController::class, 'returnBook'])->name('return');
        });
    });

    // Közlekedés..
    Route::prefix('transports')->name('transports.')->group(function () {
        Route::get('/', [TransportController::class, 'index'])->name('index');
        Route::post('/', [TransportController::class, 'store'])->name('store');
        Route::get('{id}', [TransportController::class, 'show'])->name('show');
        Route::put('{id}', [TransportController::class, 'update'])->name('update');
        Route::delete('{id}', [TransportController::class, 'destroy'])->name('destroy');
        Route::post('{id}/assign', [TransportController::class, 'assignStudent'])->name('assign');
        Route::delete('{id}/remove/{studentId}', [TransportController::class, 'removeStudent'])->name('remove');
    });

    // Értesítések..
    Route::apiResource('notifications', NotificationController::class)->except(['update']);  // az értesítéseket nem módosítjuk..

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::post('{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::get('meta/unread-count', [NotificationController::class, 'unreadCount'])->name('unread.count');
        Route::get('meta/user', [NotificationController::class, 'userNotifications'])->name('user');
    });
});