<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class SiswaController extends Controller
{
    use ApiResponseHandler;

    public function profile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $siswa = Siswa::with(['user', 'waliMurid', 'kelas'])->where('user_id', $user->id)->first();

            return response()->json([
                'status' => 'success',
                'message' => "Profile retrieved successfully",
                'data' => $siswa
            ], 200);
        } catch (error) {
            return response()->json([
                'status' => 'error',
                'message' => 'Siswa not found'
            ], 404);
        }

    }

    public function getAllSiswa()
    {
        try {
            $siswa = Siswa::all();

            return response()->json([
                'status' => 'success',
                'message' => $siswa->isEmpty() ? 'No siswa found' : 'Siswa retrieved successfully',
                'data' => $siswa
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllSiswa');
        }
    }

    public function getSiswaById($id)
    {
        try {
            $siswa = Siswa::where('id', $id)->first();

            if (!$siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Siswa not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Siswa retrieved successfully',
                'data' => $siswa
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getSiswaById');
        }
    }
    public function createSiswa(Request $request)
    {
        try {
            $data = $request->all();
            $validationResult = $this->validation($data);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $isExistingUserId = Siswa::where('user_id', $data['user_id'])->exists();
            if($isExistingUserId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User ID already exists'
                ], 422);
            }

            $siswa = Siswa::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Siswa created successfully',
                'data' => $siswa
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createSiswa');
        }
    }
    public function updateSiswa(Request $request, $id)
    {
        try {
            $siswa = Siswa::find($id);

            if (!$siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Siswa not found'
                ], 404);
            }

            $data = $request->all();
            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $isExistingUserId = Siswa::where('user_id', $data['user_id'])
                                    ->where('id', '!=', $id)
                                    ->exists();
            if($isExistingUserId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User ID already exists'
                ], 422);
            }

            $siswa->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Siswa updated successfully',
                'data' => $siswa
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateSiswa');
        }
    }
    public function deleteSiswa($id)
    {
        try {
            $siswa = Siswa::find($id);

            if (!$siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Siswa not found'
                ], 404);
            }

            $siswa->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Siswa deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteSiswa');
        }
    }
    public function validation($data, $id = null)
    {
        $validator = Validator::make($data, [
            'user_id' => 'required|exists:users,id',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'no_telp' => 'required|string',
            'nisn' => 'required|string|max:20|unique:siswa,nisn'.($id ? ','.$id : ''),
            'nis' => 'required|string|max:20|unique:siswa,nis'.($id ? ','.$id : ''),
            'semester' => 'required|integer|between:1,6',
            'id_kelas' => 'required|exists:kelas,id'
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
