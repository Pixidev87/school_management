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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // a tanuló neve
            $table->string('email')->unique(); // email cimnek egyedinek kell lennie
            $table->string('phone')->nullable(); // telefonszám, opcionális mező
            $table->text('address')->nullable(); // lakcím, opcionális mező
            $table->date('date_of_birth')->nullable(); // születési dátum, opcionális mező
            $table->enum('gender', ['male', 'female', 'other'])->nullable();  // neme, opcionális mező
            $table->string('roll_number')->unique(); // egyedi azonosító a tanulók számára
            $table->timestamps();
            $table->softDeletes(); // a diák törléskor nem törlődik ki az adatbázisból fizikailag, csak kap egy deleted_at időbélyeget. Így az adatok megmaradnak, visszaállítható.

            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade'); // idegen kulcs a classes táblára, ha egy osztály törlésre kerül, akkor a hozzá tartozó tanulók is törlődnek (cascade)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
