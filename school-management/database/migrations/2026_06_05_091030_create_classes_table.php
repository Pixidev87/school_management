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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('section')->nullable();
            $table->string('room_number')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('class_teacher_id') // ez az osztály osztályfőnöke és nem sima tanár..
                ->nullable() // lehet null, ha nincs még osztályfőnök
                ->constrained('teachers')
                ->onDelete('set null'); // tanár törlésekor ne töröljük az osztályt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
