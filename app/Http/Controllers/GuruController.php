<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class GuruController extends Controller
{
    public function profile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $guru = Guru::with('user')
                ->where('user_id', $user->id)
                ->first();

            return response()->json([
                'status' => 'success',
                'message' => "Profile retrieved successfully",
                'data' => $guru
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}
