<?php

namespace App\Http\Controllers;

use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use App\Traits\ApiResponseHandler;

class MataPelajaranController extends Controller
{
    use ApiResponseHandler;

    public function getAllMataPelajaran(Request $request){
        try {
            $mataPelajaran = MataPelajaran::all()->map(function ($item) {
                $item->created_at = $item->created_at->format('Y-m-d H:i:s');
                $item->updated_at = $item->updated_at->format('Y-m-d H:i:s');
                return $item;
            });

            return response()->json([
                'status' => 'success',
                'message' => $mataPelajaran->isEmpty() ? 'No subjects found' : 'Successfully retrieved subjects',
                'data' => $mataPelajaran
            ], 200);

        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllMataPelajaran');
        }
    }

    public function createMataPelajaran(Request $request){
        try {
            $request->validate([
                'nama_pelajaran' => 'required|string|max:255',
            ]);

            $namaPelajaran = strtolower($request->input('nama_pelajaran'));

            // Check for existing mata pelajaran
            $existing = MataPelajaran::where('nama_pelajaran', $namaPelajaran)->first();
            if ($existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Subject already exists in database'
                ], 400);
            }

            $mataPelajaran = MataPelajaran::create([
                'nama_pelajaran' => $namaPelajaran
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Subject successfully added',
                'data' => $mataPelajaran
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createMataPelajaran');
        }
    }

    public function updateMataPelajaran(Request $request){
        try {
            $id = request()->route('id_mata_pelajaran');
            $mataPelajaran = MataPelajaran::find($id);

            if (!$mataPelajaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Subject not found'
                ], 404);
            }

            $request->validate([
                'nama_pelajaran' => 'required|string|max:255',
            ]);
            $namaPelajaran = $request->input('nama_pelajaran');
            $existing = MataPelajaran::where('nama_pelajaran', $namaPelajaran)->first();
            if($existing && $existing->id !== $mataPelajaran->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Subject already exists in database'
                ], 400);
            }

            $mataPelajaran->update([
                'nama_pelajaran' => strtolower($namaPelajaran)
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Subject successfully updated',
                'data' => $mataPelajaran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateMataPelajaran');
        }
    }

    public function deleteMataPelajaran(Request $request){
        try {
            $id = request()->route('id_mata_pelajaran');
            $mataPelajaran = MataPelajaran::find($id);

            if (!$mataPelajaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Subject not found'
                ], 404);
            }

            $mataPelajaran->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Subject successfully deleted'
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteMataPelajaran');
        }
    }
}
