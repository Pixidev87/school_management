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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['notice', 'announcement', 'reminder', 'alert']); //tipusok: általános közlemény, fontos bejelentés, emlékeztető (pl dijfizetés), sürgős figyelmeztetés
            $table->enum('target', ['all', 'students', 'teachers', 'parents']);
            $table->enum('channel', ['app', 'email', 'sms'])->default('app');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null'); // melyik admin hozta létre az értesitést
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
