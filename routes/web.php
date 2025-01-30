<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User;

Route::get('/', [User::class, 'test']);
