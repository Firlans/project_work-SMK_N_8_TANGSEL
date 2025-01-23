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
        Schema::create('kehadiran', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_siswa');
            $table->date('tanggal');
            $table->enum('status', ['Hadir', 'Izin', 'Sakit', 'Alfa']);
            $table->unsignedBigInteger('mata_pelajaran_id');
            $table->time('jam');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            
            $table->foreign('id_siswa')->references('id_siswa')->on('siswa');
            $table->foreign('mata_pelajaran_id')->references('id_mata_pelajaran')->on('mata_pelajaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kehadiran');
    }
};
