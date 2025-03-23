<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminController extends Controller
{
    public function profile()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $guru = Guru::with('user')
                ->where('user_id', $user->id)
                ->first();

            return response()->json([
                'status' => 'success',
                'data' => $guru
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}
