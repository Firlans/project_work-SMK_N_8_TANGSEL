<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kehadiran;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class AbsenController extends Controller
{
    public function getKehadiran()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Debug user and siswa relationship
            error_log("User Data Details:");
            foreach ($user->toArray() as $key => $value) {
                error_log("$key => $value");
            }

            // Get siswa_id from user's siswa relationship
            $siswa = $user->siswa;
            if (!$siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Siswa data not found'
                ], 404);
            }

            $kehadiran = Kehadiran::with(['jadwal' => function($query) {
                    $query->with('mataPelajaran'); // Ensure proper eager loading
                }])
                ->where('id_siswa', $siswa->id)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $kehadiran
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in getKehadiran:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch attendance data: ' . $e->getMessage()
            ], 500);
        }
    }
}
