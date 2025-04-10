<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AbsenController;
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
        Route::get('/absen', [AbsenController::class, 'getKehadiran']);
    });
});