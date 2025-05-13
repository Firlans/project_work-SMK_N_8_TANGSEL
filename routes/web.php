<?php

use App\Events\TestingEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function(){
    return view('BroadcastTesting');
});
Route::get('/send-message/{message}', function($message){

    event(new TestingEvent($message));

    return 'done';
});

Route::post('/login', [AuthController::class, 'login']);
Route::get('/dashboard', [SiswaController::class, 'siswa']);
Route::get('/admin', [GuruController::class, 'admin']);
Route::get('/teacher', [GuruController::class, 'teacher']);
Route::get('/konselor', [GuruController::class, 'konselor']);
