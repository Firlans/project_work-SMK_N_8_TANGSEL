<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class JadwalController extends Controller
{
    public function getAllJadwal()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $jadwal = Jadwal::all();

            return response()->json([
                'status' => 'success',
                'message' => $jadwal->isEmpty() ? 'No schedule data found' : 'Successfully retrieved schedule data',
                'data' => $jadwal
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllJadwal');
        }
    }

    public function getJadwalBySiswa(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_siswa = $request->query('id_siswa');

            if (!$id_siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student ID not found'
                ], 400);
            }

            $jadwal = Jadwal::select('jadwal.*')
                ->leftJoin('kelas', 'kelas.id', '=', 'jadwal.id_kelas')
                ->leftJoin('siswa', 'siswa.id_kelas', '=', 'kelas.id')
                ->where('siswa.id', $id_siswa)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $jadwal->isEmpty() ? 'No student schedule records found' : 'Successfully retrieved student schedule',
                'data' => $jadwal
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getJadwalBySiswa');
        }
    }

    public function getJadwalBySiswaMapel(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_siswa = $request->query('id_siswa');
            $id_mapel = $request->query('id_mata_pelajaran');

            if (!$id_siswa || !$id_mapel) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student ID or Subject ID not found'
                ], 400);
            }

            $jadwal = Jadwal::select('jadwal.*')
                ->leftJoin('kelas', 'kelas.id', '=', 'jadwal.id_kelas')
                ->leftJoin('siswa', 'siswa.id_kelas', '=', 'kelas.id')
                ->where('siswa.id', $id_siswa)
                ->where('id_mata_pelajaran', $id_mapel)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $jadwal->isEmpty() ? 'No student schedule records found' : 'Successfully retrieved student schedule by subject',
                'data' => $jadwal
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getJadwalBySiswaMapel');
        }
    }
    public function getJadwalBySiswaHari(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_siswa = $request->query('id_siswa');
            $id_hari = $request->query('id_hari');

            if (!$id_siswa || !$id_hari) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student ID or Day not found'
                ], 400);
            }

            $jadwal = Jadwal::select('jadwal.*')
                ->leftJoin('kelas', 'kelas.id', '=', 'jadwal.id_kelas')
                ->leftJoin('siswa', 'siswa.id_kelas', '=', 'kelas.id')
                ->where('siswa.id', $id_siswa)
                ->where('id_hari', $id_hari)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $jadwal->isEmpty() ? 'No student schedule records found' : 'Successfully retrieved student schedule by day',
                'data' => $jadwal
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getJadwalBySiswaHari');
        }
    }

    private function handleError(\Exception $e, $context)
    {
        Log::error("Error in {$context}:", [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        $response = [
            'status' => 'error',
            'message' => "An error occurred in {$context}"
        ];

        if (config('app.debug')) {
            $response['error'] = $e->getMessage();
        }

        return response()->json($response, 500);
    }
}
