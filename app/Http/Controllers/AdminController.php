<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminController extends Controller
{
    use ApiResponseHandler;
    public function profile()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $guru = Guru::with('user')
                ->where('user_id', $user->id)
                ->first();

            return response()->json([
                'status' => 'success',
                'data' => $guru
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function getAllAdmin()
    {
        try {
            $admins = Guru::select('guru.*')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->join('privileges', 'privileges.id_user', '=', 'users.id')
                ->join('jadwal', 'jadwal.id_guru', '=', 'guru.id')
                ->where('users.profile', 'guru')
                ->where(function ($query) {
                    $query->where('privileges.is_admin', true)
                        ->orWhere('privileges.is_superadmin', true);
                })
                ->get();

            return $this->handleReturnData($admins, 'Admin');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllAdmin');
        }
    }

    public function getAdminById($id)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("siswa id = {$id}");
            }

            $admin = Guru::select('guru.*')
                ->join('users', 'users.id', '=', 'guru.user_id')
                ->join('privileges', 'privileges.id_user', '=', 'users.id')
                ->join('jadwal', 'jadwal.id_guru', '=', 'guru.id')
                ->where('users.profile', 'guru')
                ->where(function ($query) {
                    $query->where('privileges.is_admin', true)
                        ->orWhere('privileges.is_superadmin', true);
                })
                ->where('guru.id', $id)
                ->first();

            if (!$admin) {
                return $this->handleNotFoundData($id, 'Admin');
            }

            return $this->handleReturnData($admin, 'Admin');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAdminById');
        }
    }

    public function updateAdmin($id, Request $request)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("admin id = {$id}");
            }

            $data = $request->all();
            $validationResult = $this->validation($data, $id);
            if($validationResult !== true) {
                return $validationResult;
            }

            $admin = Guru::find($id);

            if (!$admin) {
                return $this->handleNotFoundData($id, 'Admin');
            }
            $admin->update($data);
            if (isset($data['nama'])) {
                $admin->user()->update([
                    'name' => $data['nama']
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Admin updated successfully',
                'data' => $admin
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateAdmin');
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
