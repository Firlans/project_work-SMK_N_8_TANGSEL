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
    return 'server is running';
});
