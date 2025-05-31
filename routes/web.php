<?php

use App\Events\TestingEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\User;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/', function(){
    return view('BroadcastTesting');
});
Broadcast::routes([
    'middleware' => [JwtMiddleware::class],
]);


Route::post('/login', [AuthController::class, 'login']);
Route::get('/dashboard', [SiswaController::class, 'siswa']);
Route::get('/admin', [GuruController::class, 'admin']);
Route::get('/teacher', [GuruController::class, 'teacher']);
Route::get('/konselor', [GuruController::class, 'konselor']);
