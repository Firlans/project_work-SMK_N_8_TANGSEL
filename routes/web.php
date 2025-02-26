<?php

use App\Http\Controllers\User;
use Illuminate\Support\Facades\Route;

Route::get('/', [User::class, 'test']);
