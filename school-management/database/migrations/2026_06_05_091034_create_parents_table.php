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
        Schema::create('parents', function (Blueprint $table) {
            $table->id();
            $table->string('guardian_name');
            $table->string('email')->unique()->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->enum('relationship', ['father', 'mother', 'guardian']);
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parents');
    }
};
