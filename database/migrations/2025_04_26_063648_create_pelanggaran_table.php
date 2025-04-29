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
        Schema::create('pelanggaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pelanggaran');
            $table->string('nama_foto')->nullable();
            $table->string('deskripsi');
            $table->enum('status', ['pengajuan', 'ditolak', 'proses', 'selesai']);
            $table->foreignId('pelapor')->constrained('users')->onDelete('cascade');
            $table->foreignId('terlapor')->constrained('siswa')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggaran');
    }
};
