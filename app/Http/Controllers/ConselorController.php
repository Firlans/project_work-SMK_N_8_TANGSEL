<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class ConselorController extends Controller
{
    use ApiResponseHandler;

    public function profile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $conselor = User::with(['siswa', 'guru'])->where('id', $user->id)->first();

            if (!$conselor) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Conselor not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => "Profile retrieved successfully",
                'data' => $conselor
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'profile');
        }
    }

    public function getAllConselor()
    {
        try {
            $conselors = Guru::select('guru.*', 'mata_pelajaran.nama_pelajaran')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->join('privileges', 'privileges.id_user', '=', 'users.id')
                ->join('jadwal', 'jadwal.id_guru', '=', 'guru.id')
                ->join('mata_pelajaran', 'mata_pelajaran.id', '=', 'jadwal.id_mata_pelajaran')
                ->where('users.profile', 'guru')
                ->where('privileges.is_conselor', '=', true)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => $conselors->isEmpty() ? 'No conselor found' : 'Conselors retrieved successfully',
                'data' => $conselors
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllConselor');
        }
    }

    public function getConselorById($id)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("Conselor id = {$id}");
            }

            $conselor = Guru::select('guru.*', 'mata_pelajaran.nama_pelajaran')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->join('privileges', 'privileges.id_user', '=', 'users.id')
                ->join('jadwal', 'jadwal.id_guru', '=', 'guru.id')
                ->join('mata_pelajaran', 'mata_pelajaran.id', '=', 'jadwal.id_mata_pelajaran')
                ->where('users.profile', 'guru')
                ->where('privileges.is_conselor', '=', true)
                ->where('guru.id', '=', $id)
                ->first();

            if (!$conselor) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Conselor not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Conselor retrieved successfully',
                'data' => $conselor
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getConselorById');
        }
    }

    public function updateConselor(Request $request, $id)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("Conselor id = {$id}");
            }


            $data = $request->except('role');
            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }
            $conselor = Guru::select('guru.*')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->where('users.profile', '=', 'guru')
                ->where('guru.id', $id)
                ->first();

            if (!$conselor) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Conselor not found'
                ], 404);
            }

            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }

            $conselor->update($data);

            if (isset($data['nama'])) {
                $conselor->user()->update([
                    'name' => $data['nama']
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Conselor updated successfully',
                'data' => $conselor
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateConselor');
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
