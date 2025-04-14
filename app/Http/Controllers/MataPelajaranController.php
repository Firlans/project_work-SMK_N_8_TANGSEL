<?php

namespace App\Http\Controllers;

use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MataPelajaranController extends Controller
{
    public function getAllMataPelajaran(Request $request){
        try {
            $mataPelajaran = MataPelajaran::all();

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
}
