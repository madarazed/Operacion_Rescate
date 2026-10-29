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
        Schema::create('rescue_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('player_name', 60);
            $table->integer('score');
            $table->integer('time_left');
            $table->integer('errors_count')->default(0);
            $table->boolean('completed')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rescue_sessions');
    }
};
