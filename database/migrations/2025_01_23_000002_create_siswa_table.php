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
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('nama_lengkap');
            $table->string('jenis_kelamin', 1);
            $table->date('tanggal_lahir');
            $table->text('alamat');
            $table->string('no_telp');
            $table->string('nisn', 20)->unique();
            $table->string('nis', 20)->unique();
            $table->integer('semester');
            $table->unsignedBigInteger('id_kelas');
            $table->timestamps();
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
