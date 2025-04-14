<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AbsenController;
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
        Route::get('/absen/mata-pelajaran', [AbsenController::class, 'getKehadiranByMataPelajaran']);
        Route::get('/absen/kelas/{id}', [AbsenController::class, 'getKehadiranByKelasId']);

        // route jadwal
        Route::get('/mata-pelajaran', [MataPelajaranController::class, 'getAllMataPelajaran']);
    });
});