<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\GuruResource;
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
            $guru = Guru::select('guru.*', 'mata_pelajaran.nama_pelajaran')
                ->leftJoin('users', 'users.id', '=', 'guru.user_id')
                ->leftJoin('privileges', 'privileges.id_user', '=', 'users.id')
                ->leftJoin('jadwal', 'jadwal.id_guru', '=', 'guru.id')
                ->leftJoin('mata_pelajaran', 'mata_pelajaran.id', '=', 'jadwal.id_mata_pelajaran')
                ->where('users.profile', 'guru')
                ->where('privileges.is_guru', '=', true)
                ->get();
            $groupedGuru = GuruResource::grouping($guru);
            return response()->json([
                'status' => 'success',
                'message' => $guru->isEmpty() ? 'No guru found' : 'Guru retrieved successfully',
                'data' => $groupedGuru
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllGuru');
        }
    }

    public function getGuruByMataPelajaranId($id)
    {
        try {
            $guru = Guru::select('guru.*', 'mata_pelajaran.nama_pelajaran')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->join('privileges', 'privileges.id_user', '=', 'users.id')
                ->join('jadwal', 'jadwal.id_guru', '=', 'guru.id')
                ->join('mata_pelajaran', 'mata_pelajaran.id', '=', 'jadwal.id_mata_pelajaran')
                ->where('users.profile', 'guru')
                ->where('privileges.is_guru', '=', true)
                ->where('jadwal.id_mata_pelajaran', '=', $id)
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
            $guru = Guru::select('guru.*', 'mata_pelajaran.nama_pelajaran')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->join('privileges', 'privileges.id_user', '=', 'users.id')
                ->join('jadwal', 'jadwal.id_guru', '=', 'guru.id')
                ->join('mata_pelajaran', 'mata_pelajaran.id', '=', 'jadwal.id_mata_pelajaran')
                ->where('users.profile', 'guru')
                ->where('privileges.is_guru', '=', true)
                ->where('guru.id', '=', $id)
                ->get();

            if ($guru->isEmpty()) {
                return $this->handleNotFoundData($id, 'Guru');
            }
            $groupedGuru = GuruResource::grouping($guru);

            return response()->json([
                'status' => 'success',
                'message' => 'Guru retrieved successfully',
                'data' => $groupedGuru[0]
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getGuruById');
        }
    }

    public function getGuruByUserId($id)
    {
        try {
            $guru = Guru::select('guru.*')
            ->leftJoin('users', 'users.id', '=', 'guru.user_id')
            ->where('users.profile', 'guru')
            ->where('user_id', $id)
            ->first();

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
            return $this->handleError($e, 'getGuruByUserId');
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
