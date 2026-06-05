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
        Schema::create('transport_stops', function (Blueprint $table) {
            $table->id();
            $table->string('stop_name');
            $table->time('pickup_time')->nullable();
            $table->time('drop_time')->nullable();
            $table->integer('order'); // ez határozza meg a sorrendet egy járaton, hogy melyik az első, melyik a második megálló és igy tovább...
            $table->timestamps();

            $table->foreignId('transport_id')->constrained('transports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transport_stops');
    }
};
