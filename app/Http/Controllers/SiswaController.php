<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class SiswaController extends Controller
{
    public function profile(Request $request)
    {
        try{
            $user = JWTAuth::parseToken()->authenticate();
            $siswa = Siswa::with(['user', 'waliMurid', 'kelas', 'semester'])->where('user_id', $user->id)->first();

            return response()->json([
                'status' => 'success',
                'message' => "Profile retrieved successfully",
                'data' => $siswa
            ], 200);
        }catch(error){
            return response()->json([
                'status' => 'error',
                'message' => 'Siswa not found'
            ], 404);
        }

    }
}
