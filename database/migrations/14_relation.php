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
        // Relasi antara kelas dan siswa (ketua_kelas di kelas)
        Schema::table('kelas', function (Blueprint $table) {
            $table->foreign('ketua_kelas')
                ->references('id')
                ->on('siswa')
                ->onDelete('set null');
        });

        // Relasi antara siswa dan kelas
        Schema::table('siswa', function (Blueprint $table) {
            $table->foreign('id_kelas')
                ->references('id')
                ->on('kelas')
                ->onDelete('cascade');
            $table->rememberToken();
        });

        // Relasi antara jadwal dan kelas
        Schema::table('jadwal', function (Blueprint $table) {
            $table->foreign('id_kelas')
                ->references('id')
                ->on('kelas')
                ->onDelete('cascade');
            $table->foreign('id_guru')
                ->references('id')
                ->on('guru')
                ->onDelete('cascade');
            $table->foreign('id_hari')
                ->references('id')
                ->on('hari')
                ->onDelete('cascade');
        });

        Schema::table('kehadiran', function (Blueprint $table) {
            $table->foreign('id_siswa')
                ->references('id')
                ->on('siswa')
                ->onDelete('cascade');
            $table->foreign('id_pertemuan')
                ->references('id')
                ->on('pertemuan')
                ->onDelete('cascade');
        });

        Schema::table('chat_rooms', function (Blueprint $table) {
            $table->foreign('id_user_siswa')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->foreign('id_user_guru')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
        Schema::table('chat_details', function (Blueprint $table) {
            $table->foreign('id_chat_room')
                ->references('id')
                ->on('chat_rooms')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop foreign keys in reverse order
        Schema::table('chat_details', function (Blueprint $table) {
            $table->dropForeign(['id_chat_room']);
        });

        Schema::table('chat_rooms', function (Blueprint $table) {
            $table->dropForeign(['id_user_siswa']);
            $table->dropForeign(['id_user_guru']);
        });

        Schema::table('kehadiran', function (Blueprint $table) {
            $table->dropForeign(['id_siswa']);
            $table->dropForeign(['id_pertemuan']);
        });

        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropForeign(['id_kelas']);
            $table->dropForeign(['id_guru']);
            $table->dropForeign(['id_hari']);
        });

        Schema::table('siswa', function (Blueprint $table) {
            $table->dropForeign(['id_kelas']);
        });

        Schema::table('kelas', function (Blueprint $table) {
            $table->dropForeign(['ketua_kelas']);
        });
    }
};
