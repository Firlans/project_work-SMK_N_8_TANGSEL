<?php

namespace App\Http\Controllers;

use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MataPelajaranController extends Controller
{
    public function getAllMataPelajaran(Request $request){
        try {
            $mataPelajaran = MataPelajaran::all()->map(function ($item) {
                $item->created_at = $item->created_at->format('Y-m-d H:i:s');
                $item->updated_at = $item->updated_at->format('Y-m-d H:i:s');
                return $item;
            });

            if ($mataPelajaran->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'data' => []
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => $mataPelajaran
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in getAllMataPelajaran: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data mata pelajaran'
            ], 500);
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
                    'message' => 'Mata pelajaran sudah ada dalam database'
                ], 400);
            }

            $mataPelajaran = MataPelajaran::create([
                'nama_pelajaran' => $namaPelajaran
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Mata pelajaran berhasil ditambahkan',
                'data' => $mataPelajaran
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in createMataPelajaran: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menambahkan mata pelajaran'
            ], 500);
        }
    }
}
