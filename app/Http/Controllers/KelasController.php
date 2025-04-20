<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class KelasController extends Controller
{
    use ApiResponseHandler;

    public function getAllKelas()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $kelas = Kelas::all();

            return response()->json([
                'status' => 'success',
                'message' => $kelas->isEmpty() ? 'No class data found' : 'Successfully retrieved class data',
                'data' => $kelas
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllKelas');
        }
    }

    public function getKelasById($id_kelas)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $kelas = Kelas::where('id', $id_kelas)->first();

            if (!$kelas) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Class not found',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Class found',
                'data' => $kelas,
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKelasById');
        }
    }
    public function createKelas(Request $request)
    {
        $data = $request->all();

        $validationResult = $this->validatioon($data);

        if ($validationResult !== true) {
            return $validationResult;
        }

        try {
            $user = JWTAuth::parseToken()->authenticate();

            $isExisting = Kelas::where('nama_kelas', $request->input('nama_kelas'))
                ->where('tingkat', $request->input('tingkat'))
                ->exists();
            if ($isExisting) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Class already exists',
                ], 422);
            }

            $kelas = Kelas::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Class created successfully',
                'data' => $kelas,
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createKelas');
        }
    }
    public function updateKelas(Request $request, $id_kelas)
    {
        $data = $request->all();

        $validationResult = $this->validatioon($data);

        if ($validationResult !== true) {
            return $validationResult;
        }

        try {
            $user = JWTAuth::parseToken()->authenticate();
            $kelas = Kelas::where('id', $id_kelas)->first();
            if (!$kelas) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Class not found',
                ], 404);
            }
            $isExisting = Kelas::where('nama_kelas', $request->input('nama_kelas'))
                ->where('tingkat', $request->input('tingkat'))
                ->where('id', '!=', $id_kelas)
                ->exists();

            if ($isExisting) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Class already exists',
                ], 422);
            }

            $kelas->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Class updated successfully',
                'data' => $kelas,
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateKelas');
        }
    }
    public function deleteKelas($id_kelas)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $kelas = Kelas::where('id', $id_kelas)->first();
            if (!$kelas) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Class not found',
                ], 404);
            }

            $kelas->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Class deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteKelas');
        }
    }

    public function validatioon($data)
    {
        $validator = Validator::make($data, [
            'nama_kelas' => 'required|string|max:255',
            'tingkat' => 'required|string|max:255',
            'ketua_kelas'=> 'nullable|exists:siswa,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        return true;
    }
}
