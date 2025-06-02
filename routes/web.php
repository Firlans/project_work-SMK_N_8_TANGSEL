<?php

use App\Events\TestingEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\User;
use App\Http\Middleware\JwtMiddleware;
use App\Mail\Email;
use Illuminate\Support\Facades\Route;

Route::get('/', function(){
    return view('BroadcastTesting');
});
Broadcast::routes([
    'middleware' => [JwtMiddleware::class],
]);
Route::post('/send-email/{name}', function($name){
    $to = 'firlansyah54321@gmail.com';
    $send = Mail::to($to)->send(new Email($name));
    \Log::info('pengiriman'. json_encode($send));
    return 'email already send';
});


Route::post('/login', [AuthController::class, 'login']);
Route::get('/dashboard', [SiswaController::class, 'siswa']);
Route::get('/admin', [GuruController::class, 'admin']);
Route::get('/teacher', [GuruController::class, 'teacher']);
Route::get('/konselor', [GuruController::class, 'konselor']);
