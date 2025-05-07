<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class GuruController extends Controller
{
    use ApiResponseHandler;

    public function profile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $guru = Guru::with('user')->where('user_id', $user->id)->first();

            if (!$guru) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Guru not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => "Profile retrieved successfully",
                'data' => $guru
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'profile');
        }
    }

    public function getAllGuru()
    {
        try {
            $guru = Guru::select('guru.*')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->where('users.role', '=', 'guru')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $guru->isEmpty() ? 'No guru found' : 'Guru retrieved successfully',
                'data' => $guru
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllGuru');
        }
    }

    public function getGuruByMataPelajaranId($id)
    {
        try {
            $guru = Guru::select('guru.*')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->where('users.role', '=', 'guru')
                ->where('mata_pelajaran_id', $id)
                ->get();

            if ($guru->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Guru not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Guru retrieved successfully',
                'data' => $guru
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getGuruByMataPelajaranId');
        }
    }

    public function getGuruById($id)
    {
        try {
            $guru = Guru::select('guru.*')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->where('users.role', '=', 'guru')
                ->where('guru.id', $id)->first();

            if (!$guru) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Guru not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Guru retrieved successfully',
                'data' => $guru
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getGuruById');
        }
    }

    public function updateGuru(Request $request, $id)
    {
        try {
            $guru = Guru::find($id);

            if (!$guru) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Guru not found'
                ], 404);
            }

            $data = $request->except('user_id');
            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $guru->update($data);

            if (isset($data['nama'])) {
                $guru->user()->update([
                    'name' => $data['nama']
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Guru updated successfully',
                'data' => $guru
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateGuru');
        }
    }

    private function validation($data, $id = null)
    {
        $validator = Validator::make($data, [
            'nip' => 'required|string|max:20|unique:guru,nip' . ($id ? ',' . $id : ''),
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'required|date|before:today',
            'alamat' => 'required|string',
            'no_telp' => 'required|string|max:15',
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id'
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