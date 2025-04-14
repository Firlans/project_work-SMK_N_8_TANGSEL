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

    public function getKehadiranByKelas(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_mata_pelajaran = $request->query('id_mata_pelajaran');

            if (!$id_mata_pelajaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'id_mata_pelajaran is required'
                ], 400);
            }

            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran', 'siswa'])
                ->whereHas('jadwal', function($query) use ($id_mata_pelajaran) {
                    $query->where('id_mata_pelajaran', $id_mata_pelajaran);
                })
                ->get();

            if ($kehadiran->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'data' => [],
                    'message' => 'No attendance records found'
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => KehadiranResource::collection($kehadiran)
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error in getKehadiranByKelas:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'id_mata_pelajaran' => $id_mata_pelajaran
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch attendance data',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
