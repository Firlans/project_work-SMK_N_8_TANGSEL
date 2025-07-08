<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Kehadiran;
use Illuminate\Support\Facades\Validator;
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

            return response()->json(
                [
                    'status' => 'success',
                    'message' => $kehadiran->isEmpty() ? 'No attendance data found' : 'Successfully retrieved attendance data',
                    'data' => $kehadiran,
                ],
                200,
            );
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
                return response()->json(
                    [
                        'status' => 'error',
                        'message' => 'Student ID not found',
                    ],
                    400,
                );
            }

            $kehadiran = Kehadiran::select(['kehadiran.*', 'pertemuan.*'])
                ->join('pertemuan', 'pertemuan.id', '=', 'kehadiran.id_pertemuan')
                ->where('kehadiran.id_siswa', '=', $id_siswa)
                ->get();
            return response()->json(
                [
                    'status' => 'success',
                    'message' => $kehadiran->isEmpty() ? 'No student attendance records found' : 'Successfully retrieved student attendance',
                    'data' => $kehadiran,
                ],
                200,
            );
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
                return response()->json(
                    [
                        'status' => 'error',
                        'message' => 'Subject ID and Student ID are required',
                    ],
                    400,
                );
            }

            $kehadiran = Kehadiran::select(['kehadiran.*', 'pertemuan.*'])
                ->join('pertemuan', 'pertemuan.id', '=', 'kehadiran.id_pertemuan')
                ->join('jadwal', 'jadwal.id', '=', 'pertemuan.id_jadwal')
                ->join('guru', 'guru.id', '=', 'jadwal.id_guru')
                ->where('kehadiran.id_siswa', '=', $id_siswa)
                ->where('guru.mata_pelajaran_id', '=', $id_mata_pelajaran)
                ->get();

            return response()->json(
                [
                    'status' => 'success',
                    'message' => $kehadiran->isEmpty() ? 'No attendance records found' : 'Successfully retrieved attendance records',
                    'data' => $kehadiran,
                ],
                200,
            );
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
                return response()->json(
                    [
                        'status' => 'error',
                        'message' => 'Student ID and Class ID are required',
                    ],
                    400,
                );
            }

            $kehadiran = Kehadiran::select()
                ->join('pertemuan', 'pertemuan.id', '=', 'kehadiran.id_pertemuan')
                ->join('jadwal', 'jadwal.id', '=', 'pertemuan.id_jadwal')
                ->where('jadwal.id_kelas', '=', $id_kelas)
                ->where('kehadiran.id_siswa', '=', $id_siswa)
                ->get();

            return response()->json(
                [
                    'status' => 'success',
                    'message' => $kehadiran->isEmpty() ? 'No attendance records found' : 'Successfully retrieved attendance records',
                    'data' => $kehadiran,
                ],
                200,
            );
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiranByKelasId');
        }
    }

    public function getKehadiranByIdSiswaAndIdPertemuan(Request $request)
    {
        try {
            $data = $request->all();

            $validationResult = $this->customValidation($data, [
                'id_siswa' => 'required|exists:siswa,id',
                'id_pertemuan' => 'required|exists:pertemuan,id',
            ]);

            if($validationResult !== true){
                return $validationResult;
            }

            $kehadiran = Kehadiran::select()
                ->where('id_pertemuan', '=', $data['id_pertemuan'])
                ->where('id_siswa', '=', $data['id_siswa'])
                ->get();

            if(!$kehadiran){
                return $this->handleNotFoundData("{$data['id_siswa']} and {$data['id_pertemuan']}",'Kehadiran','id pertemuan and id siswa' );
            }

            return $this->handleReturnData($kehadiran, 'Kehadiran');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiranByIdSiswaAndIdPertemuan');
        }
    }

    public function getKehadiranByIdPertemuan($id_pertemuan){
        try{
            $validationResult = $this->customValidation(
                ["id_pertemuan" => $id_pertemuan],
                [ 'id_pertemuan' => "required|exists:pertemuan,id"]
            );

            if($validationResult !== true){
                return $validationResult;
            }

            $kehadiran = Kehadiran::select()
                ->where('id_pertemuan', '=', $id_pertemuan)
                ->get();

            if(!$kehadiran){
                return $this->handleNotFoundData("$id_pertemuan",'Kehadiran','id pertemuan' );
            }

            return $this->handleReturnData($kehadiran, 'Kehadiran');

        }catch(\Exception $e){
            return $this->handleError($e, 'getKehadiranByIdSiswaAndIdPertemuan');
        }
    }

    public function createKehadiran(Request $request)
    {
        $validationResult = $this->validation($request->all());
        if ($validationResult !== true) {
            return $validationResult;
        }

        try {
            $kehadiran = Kehadiran::create([
                'id_siswa' => $request->id_siswa,
                'tanggal' => date('Y-m-d', strtotime($request->tanggal)),
                'status' => $request->status,
                'id_pertemuan' => $request->id_pertemuan,
                'keterangan' => $request->keterangan,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Kehadiran berhasil dicatat',
                'data' => $kehadiran,
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createKehadiran');
        }
    }

    public function updateKehadiran(Request $request, $id)
    {
        try {
            $data = $request->all();
            $validationResult = $this->validation($data);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $kehadiran = Kehadiran::find($id);

            if (!$kehadiran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Attendance not found',
                ], 404);
            }

            $kehadiran->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Attendance successfully updated',
                'data' => $kehadiran,
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
                return response()->json(
                    [
                        'status' => 'error',
                        'message' => 'Attendance not found',
                    ],
                    404,
                );
            }

            $kehadiran->delete();

            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Attendance successfully deleted',
                ],
                200,
            );
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteKehadiran');
        }
    }

    private function validation($data)
    {
        $validator = Validator::make($data, [
            'id_siswa' => 'required|exists:siswa,id',
            'tanggal' => 'required|date',
            'status' => 'nullable|in:hadir,izin,sakit,alpha,ojt,ijt',
            'id_pertemuan' => 'required|exists:pertemuan,id',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        return true;
    }

    private function customValidation($data, $rules){
        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        return true;
    }
}
