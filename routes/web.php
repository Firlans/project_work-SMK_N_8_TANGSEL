<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function(){
        return response()->json([
            'status' => 'success',
            'message' => 'Server Sedang Berjalan',
        ], 200);
});
Route::post('/login', [AuthController::class, 'login']);
Route::get('/dashboard', [SiswaController::class, 'siswa']);
Route::get('/admin', [GuruController::class, 'admin']);
Route::get('/teacher', [GuruController::class, 'teacher']);
Route::get('/conselor', [GuruController::class, 'conselor']);
