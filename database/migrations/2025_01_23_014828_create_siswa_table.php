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
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('jenis_kelamin', 1);
            $table->date('tanggal_lahir');
            $table->text('alamat');
            $table->string('no_telp');
            $table->string('nisn', 20)->unique();
            $table->string('nis', 20)->unique();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('id_kelas');
            $table->timestamps();
            
            $table->foreign('id_kelas')->references('id_kelas')->on('kelas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
