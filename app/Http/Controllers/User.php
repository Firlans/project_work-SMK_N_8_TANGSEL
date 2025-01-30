<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class User extends Controller
{
    public function test()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Server Sedang Berjalan',
        ], 200);
    }
}
