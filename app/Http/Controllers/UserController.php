<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Privilege;
use App\Models\Siswa;
use App\Models\User;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
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
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("user id = {$id}");
            }


            $user = User::where('id', $id)->first();

            if (!$user) {
                return $this->handleNotFoundData($user, 'User');
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

            if (is_array($request->privileges)) {
                foreach ($request->privileges as $key => $value) {
                    if (array_key_exists($key, $privileges)) {
                        $privileges[$key] = (bool) $value;
                    }
                }
            }
            Privilege::create($privileges);
            $user->load('privileges');
            return $this->handleReturnData($user, 'User');

        } catch (\Exception $e) {
            return $this->handleError($e, 'createUser');
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            if (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            ) {
                return $this->invalidParameter("user id = {$id}");
            }

            $user = User::with('privileges')->find($id);
            if (!$user) {
                return $this->handleNotFoundData($user, 'User');
            }
            $data = $request->all();
            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            \Log::info('user' . json_encode($user));
            if (isset($request->privileges)) {
                $privileges = [
                    'is_superadmin' => false,
                    'is_admin' => false,
                    'is_guru' => false,
                    'is_siswa' => false,
                    'is_conselor' => false
                ];

                foreach ($request->privileges as $key => $value) {
                    if (array_key_exists($key, $privileges)) {
                        $privileges[$key] = $value;
                    }
                }

                $user->privileges()->update($privileges);
                $user->load('privileges');
            }
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
            $user = User::with(['siswa', 'guru', 'privileges'])->find($id);
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
            if ($user->privileges) {
                $user->privileges->delete();
            }

            $isDeleted = $user->delete();

            if(!$isDeleted){
                return $this->handleFail('delete', 'user');
            }

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
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($id),
            ],
            'password' => $id ? 'nullable|string|min:8' : 'required|string|min:8',
            'profile' => $id ? 'nullable|in:guru,siswa' : 'required|in:guru,siswa',
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
