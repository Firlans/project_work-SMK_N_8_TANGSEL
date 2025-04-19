<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kehadiran;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\KehadiranResource;
use App\Traits\ApiResponseHandler;

class AbsenController extends Controller
{
    use ApiResponseHandler;

    public function getAllKehadiran()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $kehadiran = Kehadiran::all();

            return response()->json([
                'status' => 'success',
                'message' => $kehadiran->isEmpty() ? 'No attendance data found' : 'Successfully retrieved attendance data',
                'data' => $kehadiran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllKehadiran');
        }
    }

    public function getKehadiranBySiswaId(Request $request)
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

            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran', 'siswa'])
                ->where('id_siswa', $id_siswa)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $kehadiran->isEmpty() ? 'No student attendance records found' : 'Successfully retrieved student attendance',
                'data' => $kehadiran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiran');
        }
    }

    public function getKehadiranByIdSiswaAndMataPelajaran(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_mata_pelajaran = $request->query('id_mata_pelajaran');
            $id_siswa = $request->query('id_siswa');

            if (!$id_mata_pelajaran || !$id_siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Subject ID and Student ID are required'
                ], 400);
            }

            $kehadiran = Kehadiran::where('id_siswa', $id_siswa)
                ->whereHas('jadwal', function ($query) use ($id_mata_pelajaran) {
                    $query->where('id_mata_pelajaran', $id_mata_pelajaran);
                })
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $kehadiran->isEmpty() ? 'No attendance records found' : 'Successfully retrieved attendance records',
                'data' => $kehadiran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiranByIdSiswaAndMataPelajaran');
        }
    }

    public function getKehadiranByIdSiswaAndKelasId()
    {
        try {
            $id_siswa = request()->query('id_siswa');
            $id_kelas = request()->query('id_kelas');

            if (!$id_siswa || !$id_kelas) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student ID and Class ID are required'
                ], 400);
            }

            $kehadiran = Kehadiran::where('id_siswa', $id_siswa)
                ->whereHas('jadwal', function ($query) use ($id_kelas) {
                    $query->where('id_kelas', $id_kelas);
                })
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $kehadiran->isEmpty() ? 'No attendance records found' : 'Successfully retrieved attendance records',
                'data' => $kehadiran,
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiranByKelasId');
        }
    }

    public function createKehadiran(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $data = $request->all();

            $kehadiran = Kehadiran::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Attendance successfully created',
                'data' => new KehadiranResource($kehadiran)
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createKehadiran');
        }
    }

    public function updateKehadiran(Request $request, $id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $data = $request->all();

            $kehadiran = Kehadiran::find($id);

            if (!$kehadiran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Attendance not found'
                ], 404);
            }

            $kehadiran->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Attendance successfully updated',
                'data' => new KehadiranResource($kehadiran)
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateKehadiran');
        }
    }
    public function deleteKehadiran($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $kehadiran = Kehadiran::find($id);

            if (!$kehadiran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Attendance not found'
                ], 404);
            }

            $kehadiran->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Attendance successfully deleted'
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteKehadiran');
        }
    }
}