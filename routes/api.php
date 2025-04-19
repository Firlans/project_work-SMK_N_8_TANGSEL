<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AbsenController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\MataPelajaranController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\SiswaMiddleware;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware([JwtMiddleware::class])->group(function () {
    Route::get('user', [AuthController::class, 'getUser']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::middleware([RoleMiddleware::class])->group(function () {
        Route::get('/profile', function(){});
    });
    Route::middleware([SiswaMiddleware::class])->group(function(){
        // route absen
        Route::get('/absen', [AbsenController::class, 'getAllKehadiran']);
        Route::get('/absen/siswa', [AbsenController::class, 'getKehadiranBySiswaId']);
        Route::get('/absen/mata-pelajaran', [AbsenController::class, 'getKehadiranByIdSiswaAndMataPelajaran']);
        Route::get('/absen/kelas/', [AbsenController::class, 'getKehadiranByIdSiswaAndKelasId']);

        // route mata_pelajaran
        Route::get('/mata-pelajaran', [MataPelajaranController::class, 'getAllMataPelajaran']);
        Route::post('/mata-pelajaran', [MataPelajaranController::class, 'createMataPelajaran']);

        // route jadwal
        Route::get('/jadwal', [JadwalController::class, 'getAllJadwal']);
        Route::get('/jadwal/siswa', [JadwalController::class, 'getJadwalBySiswa']);
        Route::get('/jadwal/mata-pelajaran', [JadwalController::class, 'getJadwalBySiswaMapel']);
        Route::get('/jadwal/hari', [JadwalController::class, 'getJadwalBySiswaHari']);

    });
});