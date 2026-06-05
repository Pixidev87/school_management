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
        Schema::create('fees', function (Blueprint $table) {
            $table->id();
            $table->string('fee_type'); // többféle dijjat lehet beszedni. pl: oktatás, könyvtár, vizsga, utazás...
            $table->decimal('amount', 10, 2);
            $table->date('due_date'); // mikor kell fizetni
            $table->date('paid_date')->nullable(); //mikor fizették be, ha befizették...
            $table->enum('status', ['pending', 'paid', 'overdue', 'waived']);
            $table->string('receipt_number')->unique()->nullable(); // bizonylat száma, egyedinek kell lennie.
            $table->text('note')->nullable();
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
        Schema::dropIfExists('fees');
    }
};
