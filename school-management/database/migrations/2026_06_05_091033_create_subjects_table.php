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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique(); // minden tantárgynak egyedi kódja van (Math01, Eng01), ez segít az azonosításban
            $table->integer('total_periods')->default(0); // hány tanórából áll a tantárgy összesen
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null'); // melyik tanár tartja azért van összekapcsolva. Az onDelete pedig ha a tanár törlődik attól a tárgy megmarad.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
