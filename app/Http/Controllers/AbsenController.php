<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kehadiran;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\KehadiranResource;

class AbsenController extends Controller
{
    public function getAllKehadiran()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran'])->get();

            return response()->json([
                'status' => 'success',
                'data' => KehadiranResource::collection($kehadiran)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in getAllKehadiran:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch attendance data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getKehadiran(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_siswa = $request->query('id_siswa');

            if (!$id_siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'id unknown'
                ], 400);
            }

            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran'])
                ->where('id_siswa', $id_siswa)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => KehadiranResource::collection($kehadiran)
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
