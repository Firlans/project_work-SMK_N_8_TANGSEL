<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function getAllUser()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
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
            $validation = $this->validation($request->all());
            if (!$validation['status']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validation['errors']
                ], 422);
            }

            $userData = $validation['data'];
            $profileData = $validation['profile'];
            $userData['password'] = bcrypt($userData['password']);
            var_dump($userData);
            $user = User::create($userData);
            $profile = null;

            // Create associated model based on role
            if ($userData['role'] === 'siswa') {
                $profile = Siswa::create([
                    'user_id' => $user->id,
                    'nama_lengkap' => $userData['name'],
                    'jenis_kelamin' => $profileData['jenis_kelamin'] ?? 'L',
                    'tanggal_lahir' => $profileData['tanggal_lahir'] ?? now(),
                    'alamat' => $profileData['alamat'] ?? '-',
                    'no_telp' => $profileData['no_telp'] ?? '-',
                    'nisn' => $profileData['nisn'] ?? null,
                    'nis' => $profileData['nis'] ?? null,
                    'semester' => $profileData['semester'] ?? 1,
                    'id_kelas' => $profileData['id_kelas'] ?? null
                ]);
                $user->load('siswa');
            } else if (in_array($userData['role'], ['guru', 'konselor', 'admin'])) {
                $profile = Guru::create([
                    'user_id' => $user->id,
                    'mata_pelajaran_id' => $profileData['mata_pelajaran_id'] ?? 1,
                    'nama' => $userData['name'],
                    'tanggal_lahir' => $profileData['tanggal_lahir'] ?? now(),
                    'alamat' => $profileData['alamat'] ?? '-',
                    'no_telp' => $profileData['no_telp'] ?? '-',
                    'jenis_kelamin' => $profileData['jenis_kelamin'] ?? 'L',
                    'nip' => $profileData['nip'] ?? 'TEMP-' . time()
                ]);
                $user->load('guru');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => [
                    'user' => $user
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
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
            // User attributes
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255' . ($id ? ',email,' . $id : '|unique:users'),
            'password' => $id ? 'nullable|string|min:8' : 'required|string|min:8',
            'role' => 'required|in:admin,konselor,guru,siswa',
            'is_active' => 'boolean',
            'profile.jenis_kelamin' => 'nullable|in:L,P',
            'profile.tanggal_lahir' => 'nullable|date',
            'profile.alamat' => 'nullable|string',
            'profile.no_telp' => 'nullable|string',
            'profile.mata_pelajaran_id' => 'nullable|exists:mata_pelajaran,id',
            'profile.id_kelas' => 'nullable|exists:kelas,id',
            'profile.nisn' => 'nullable|string|unique:siswa,nisn',
            'profile.nis' => 'nullable|string|unique:siswa,nis',
            'profile.semester' => 'nullable|integer',
            'profile.nip' => 'nullable|string',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return [
                'status' => false,
                'errors' => $validator->errors()
            ];
        }

        $validated = $validator->validated();


        // Separate user and profile data
        $profileData = isset($validated['profile']) ? $validated['profile'] : [];
        unset($validated['profile']);

        return [
            'status' => true,
            'data' => $validated,
            'profile' => $profileData
        ];
    }
}
