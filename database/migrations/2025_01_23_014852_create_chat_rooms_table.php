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
        Schema::create('chat_rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_siswa');
            $table->unsignedBigInteger('id_guru');
            $table->enum('status', ['Open', 'Closed']);
            $table->boolean('is_private')->default(false);
            $table->timestamps();

            $table->foreign('id_siswa')->references('id_siswa')->on('siswa');
            $table->foreign('id_guru')->references('id_guru')->on('guru');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_rooms');
    }
};
