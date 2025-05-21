<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Privilege;
use App\Models\Siswa;
use App\Models\User;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    use ApiResponseHandler;
    public function getAllUser()
    {
        try {
            $users = User::with(['siswa', 'guru'])->get();

            return response()->json([
                'status' => 'success',
                'message' => $users->isEmpty() ? 'No users found' : 'Users retrieved successfully',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserById($id)
    {
        try {
            $user = User::where('id', $id)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User retrieved successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createUser(Request $request)
    {
        try {
            $validationResult = $this->validation($request->all());

            if ($validationResult !== true) {
                return $validationResult;
            }

            // Create User
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'profile' => $request->profile,
                'is_active' => $request->is_active ?? true
            ]);

            // Create Profile
            if ($request->profile === 'siswa') {
                $profile = Siswa::create([
                    'user_id' => $user->id,
                    'nama_lengkap' => $request->name,
                    'jenis_kelamin' => $request->data['jenis_kelamin'],
                    'tanggal_lahir' => $request->data['tanggal_lahir'],
                    'alamat' => $request->data['alamat'],
                    'no_telp' => $request->data['no_telp'],
                    'nisn' => $request->data['nisn'],
                    'nis' => $request->data['nis'],
                    'semester' => $request->data['semester'],
                    'id_kelas' => $request->data['id_kelas']
                ]);
                $user->load('siswa');
            } else if ($request->profile === 'guru') {
                $profile = Guru::create([
                    'user_id' => $user->id,
                    'nama' => $request->name,
                    'jenis_kelamin' => $request->data['jenis_kelamin'],
                    'nip' => $request->data['nip'],
                    'tanggal_lahir' => $request->data['tanggal_lahir'],
                    'alamat' => $request->data['alamat'],
                    'no_telp' => $request->data['no_telp']
                ]);
                $user->load('guru');
            }

            // Create Privileges
            $privileges = [
                'id_user' => $user->id,
                'is_superadmin' => false,
                'is_admin' => false,
                'is_guru' => false,
                'is_siswa' => false,
                'is_conselor' => false
            ];

            foreach ($request->privileges as $privilege) {
                $privileges[$privilege] = true;
            }

            Privilege::create($privileges);
            $user->load('privilege');
            return $this->handleReturnData($user, 'User');

        } catch (\Exception $e) {
            return $this->handleError($e, 'createUser');
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            $validation = $this->validation($request->all(), $id);
            if (!$validation['status']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validation['errors']
                ], 422);
            }

            $userData = $validation['data'];
            if (isset($userData['password'])) {
                $userData['password'] = bcrypt($userData['password']);
            } else {
                unset($userData['password']);
            }

            $user->update($userData);

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::with(['siswa', 'guru'])->find($id);
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Delete associated records first
            if ($user->siswa) {
                if ($user->siswa->waliMurid) {
                    $user->siswa->waliMurid->delete();
                }
                $user->siswa->delete();
            }
            if ($user->guru) {
                $user->guru->delete();
            }

            // Delete the user
            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User and associated records deleted successfully',
                'data' => [
                    "id" => $id
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function validation($data, $id = null)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255' . ($id ? ',email,' . $id : '|unique:users'),
            'password' => $id ? 'nullable|string|min:8' : 'required|string|min:8',
            'profile' => 'required|in:guru,siswa',
            'is_active' => 'boolean',
            'data.jenis_kelamin' => 'nullable|in:L,P',
            'data.tanggal_lahir' => 'nullable|date',
            'data.alamat' => 'nullable|string',
            'data.no_telp' => 'nullable|string',
            'data.id_kelas' => 'nullable|exists:kelas,id',
            'data.nisn' => 'nullable|string|unique:siswa,nisn',
            'data.nis' => 'nullable|string|unique:siswa,nis',
            'data.semester' => 'nullable|integer',
            'data.nip' => 'nullable|string',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        return true;
    }
}
