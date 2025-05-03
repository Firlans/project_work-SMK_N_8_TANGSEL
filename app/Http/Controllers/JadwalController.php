<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class JadwalController extends Controller
{
    use ApiResponseHandler;

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

    public function createJadwal()
    {
        try {
            $data = request()->all();
            // Add check for empty request data
            if (empty($data)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No data provided for update'
                ], 400);
            }

            $validationResult = $this->validation($data);
            if (!$validationResult) {
                return $validationResult;
            }

            $user = JWTAuth::parseToken()->authenticate();

            $jadwal = Jadwal::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully created schedule',
                'data' => $jadwal
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createJadwal');
        }
    }

    public function updateJadwal($id_jadwal)
    {
        try {
            $data = request()->all();

            // Add check for empty request data
            if (empty($data)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No data provided for update'
                ], 400);
            }

            $validationResult = $this->validation($data);
            if (!$validationResult) {
                return $validationResult;
            }

            $user = JWTAuth::parseToken()->authenticate();
            $jadwal = Jadwal::find($id_jadwal);
            if (!$jadwal) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Schedule not found'
                ], 404);
            }

            $jadwal->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully updated schedule',
                'data' => $jadwal
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateJadwal');
        }

    }

    public function deleteJadwal($id_jadwal)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $jadwal = Jadwal::find($id_jadwal);
            if (!$jadwal) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Schedule not found'
                ], 404);
            }

            $jadwal->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully deleted schedule'
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteJadwal');
        }
    }

    private function validation($data)
    {
        $validator = Validator::make($data, [
            'id_kelas' => 'required|exists:kelas,id',
            'id_mata_pelajaran' => 'required|exists:mata_pelajaran,id',
            'id_hari' => 'required|exists:hari,id',
            'id_waktu' => 'required|exists:waktu, id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        return true;
    }
}
