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
        Schema::create('chat_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_chat_room');
            $table->unsignedBigInteger('sender_id');
            $table->text('message');
            $table->timestamps();

            $table->foreign('id_chat_room')->references('id_chat_room')->on('chat_rooms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_details');
    }
};
