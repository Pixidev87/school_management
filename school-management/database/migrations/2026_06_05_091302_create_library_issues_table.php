<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('library_issues', function (Blueprint $table) {
            $table->id();
            $table->date('issues_date');
            $table->date('due_date');
            $table->date('return_date')->nullable();
            $table->decimal('fine', 8, 2)->default(0.00); // ez a késedelmi dij része
            $table->enum('status', ['issued', 'returned', 'overdue']);
            $table->timestamps();

            $table->foreignId('book_id')->constrained('library_books')->onDelete('cascade');
            $table->foreignId('student_id')->nullable()->constrained('students')->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_issues');
    }
};
