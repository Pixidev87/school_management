<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
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

// Publikus..
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('login', [AuthController::class, 'login'])
        ->name('login');
});

Route::middleware('auth:sanctum')->group(function () {

    // Diákok..
    Route::apiResource('students', StudentController::class)->only(['index', 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class)->only(['store', 'update', 'destroy']);
    });

    // Tanárok..
    // Tanárok napi beosztás lekérdezése..
    Route::apiResource('teachers', TeacherController::class)->only(['index', 'show']);
    Route::get('teachers/{id}/schedule', [TeacherController::class, 'schedule'])->name('teachers.schedule');
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('teachers', TeacherController::class)->only(['store', 'update', 'destroy']);
    });

    // Osztályok..
    // Osztály diákjainak a listázása..
    Route::apiResource('classes', SchoolClassController::class)->only(['index', 'show']);
    Route::get('classes/{id}/students', [SchoolClassController::class, 'students'])->name('classes.students');
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('classes', SchoolClassController::class)->only(['store', 'update', 'destroy']);
    });

    // Tantárgyak..
    // Tantárgyak egy tanárhoz..
    Route::apiResource('subjects', SubjectController::class)->only(['index', 'show']);
    Route::get('subjects/teacher/{teacherId}', [SubjectController::class, 'byTeacher'])->name('subjects.by-teacher');
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('subjects', SubjectController::class)->only(['store', 'update', 'destroy']);
    });

    // Jelenlétek..
    Route::prefix('attendances')->name('attendances.')->group(function () {
        Route::middleware('role:admin,teacher')->group(function () {
            Route::post('students', [AttendanceController::class, 'storeStudents'])->name('students.store');
            Route::post('teachers', [AttendanceController::class, 'storeTeachers'])->name('teachers.store');
        });
        Route::get('class/{classId}', [AttendanceController::class, 'byClass'])->name('class.index');
        Route::get('class/{classId}/history', [AttendanceController::class, 'classHistory'])->name('class.history');
        Route::get('student/{studentId}', [AttendanceController::class, 'studentStats'])->name('student.stats');
    });

    // Órarend..
    Route::prefix('timetables')->name('timetables.')->group(function () {
        Route::get('class/{classId}', [TimetableController::class, 'byClass'])->name('class.index');
        Route::get('class/{classId}/day', [TimetableController::class, 'byClassAndDay'])->name('class.day');
        Route::middleware('role:admin,teacher')->group(function () {
            Route::post('/', [TimetableController::class, 'store'])->name('store');
            Route::put('{id}', [TimetableController::class, 'update'])->name('update');
            Route::delete('{id}', [TimetableController::class, 'destroy'])->name('destroy');
        });
    });

    // Vizsgák..
    Route::apiResource('exams', ExamController::class)->only(['index', 'show']);
    Route::middleware('role:admin,teacher')->group(function () {
        Route::apiResource('exams', ExamController::class)->only(['store', 'update', 'destroy']);
        Route::post('exams/{id}/results', [ExamController::class, 'storeResults'])->name('results.store');
    });
    Route::prefix('exams')->name('exams.')->group(function () {
        Route::get('{id}/statistics', [ExamController::class, 'statistics'])->name('statistics');
        Route::get('student/{studentId}/results', [ExamController::class, 'studentResults'])->name('student.results');
    });

    // Díjjak..
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('fees', FeeController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('fees/overdue/list', [FeeController::class, 'overdue'])->name('fees.overdue');
        Route::post('fees/{id}/pay', [FeeController::class, 'pay'])->name('fees.pay');
    });

    Route::get('fees/student/{studentId}', [FeeController::class, 'byStudent'])->name('fees.student.index');
    Route::get('fees/{fee}', [FeeController::class, 'show'])->name('fees.show');


    // Könyvtár..
    Route::prefix('library')->name('library.')->group(function () {

        // Könyvek..
        Route::prefix('books')->name('books.')->group(function () {
            Route::get('/', [LibraryController::class, 'index'])->name('index');
            Route::get('{id}', [LibraryController::class, 'show'])->name('show');
            Route::middleware('role:admin')->group(function () {
                Route::post('/', [LibraryController::class, 'store'])->name('store');
                Route::put('{id}', [LibraryController::class, 'update'])->name('update');
                Route::delete('{id}', [LibraryController::class, 'destroy'])->name('destroy');
            });
            // Könyv kölcsönzése..
            Route::middleware('role:admin,teacher')->group(function () {
                Route::post('{id}/issue', [LibraryController::class, 'issue'])->name('issue');
            });
        });

        // Kölcsönzések..
        Route::prefix('issues')->name('issues.')->group(function () {
            Route::middleware('role:admin,teacher')->group(function () {
                Route::get('active', [LibraryController::class, 'activeIssues'])->name('active');
                Route::get('overdue', [LibraryController::class, 'overdueIssues'])->name('overdue');
                Route::post('{id}/return', [LibraryController::class, 'returnBook'])->name('return');
            });
        });
    });

    // Közlekedés..
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('transports', TransportController::class);
        Route::post('transports/{id}/assign', [TransportController::class, 'assignStudent'])->name('transports.assign');
        Route::delete('transports/{id}/remove/{studentId}', [TransportController::class, 'removeStudent'])->name('transports.remove');
    });

    // Értesítések..
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('notifications', NotificationController::class)->only(['store', 'destroy']);
    });
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'show']);
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::post('{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::get('meta/unread-count', [NotificationController::class, 'unreadCount'])->name('unread.count');
        Route::get('meta/user', [NotificationController::class, 'userNotifications'])->name('user');
    });

    // Be és kijelentkezés..
    // Védett (nem publikus..)
    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::get('me', [AuthController::class, 'me'])->name('me');
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('logout-all', [AuthController::class, 'logoutAll'])->name('logout-all');
        });
    });
});
