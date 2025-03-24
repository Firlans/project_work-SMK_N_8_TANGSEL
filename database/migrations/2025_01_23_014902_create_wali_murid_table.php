<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wali_murid', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_siswa')->constrained('siswa')->onDelete('cascade');
            $table->string('nama_lengkap');
            $table->string('no_telp')->unique();
            $table->string('email')->unique();
            $table->enum('status', ['ayah', 'ibu', 'wali murid']);
            $table->text('alamat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wali_murid');
    }
};
