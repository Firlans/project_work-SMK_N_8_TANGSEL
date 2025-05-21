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
        Schema::create('privileges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->unique()->constrained('users')->onDelete('cascade');;
            $table->boolean('is_superadmin')->default(false);
            $table->boolean('is_admin')->default(false);
            $table->boolean('is_guru')->default(false);
            $table->boolean('is_siswa')->default(false);
            $table->boolean('is_conselor')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('privileges');
    }
};
