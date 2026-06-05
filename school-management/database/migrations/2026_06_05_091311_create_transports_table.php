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
        Schema::create('transports', function (Blueprint $table) {
            $table->id();
            $table->string('route_name');
            $table->string('vehicle_number')->unique(); // rendszám rögzitése, egyszerre csak egy lehet.
            $table->string('driver_name');
            $table->string('driver_phone');
            $table->integer('capacity'); // hány férőhelyes a jármű
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transports');
    }
};
