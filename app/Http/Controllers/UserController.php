<?php

namespace App\Http\Controllers;

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
            $users = User::all();

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
            $userData['password'] = bcrypt($userData['password']);

            $user = User::create($userData);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => $user
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
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully',
                'data' => [
                    "id"=> $user->id
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
            'role' => 'required|in:admin,konselor,guru,siswa',
            'is_active' => 'boolean'
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return [
                'status' => false,
                'errors' => $validator->errors()
            ];
        }

        return [
            'status' => true,
            'data' => $validator->validated()
        ];
    }
}
