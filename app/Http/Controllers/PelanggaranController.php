<?php

namespace App\Http\Controllers;

use App\Models\Pelanggaran;
use App\Traits\ApiResponseHandler;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PelanggaranController extends Controller
{
    use ApiResponseHandler;
    public function getAllPelanggaran()
    {
        try {
            $pelanggaran = Pelanggaran::all();

            return response()->json([
                'status' => 'success',
                'message' => $pelanggaran->isEmpty() ? 'No pelanggaran found' : 'Pelanggaran retrieved successfully',
                'data' => $pelanggaran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllPelanggaran');
        }
    }
    public function getPelanggaranById($id)
    {
        try {
            $pelanggaran = Pelanggaran::find($id);
            if (!$pelanggaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggaran not found'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggaran retrieved successfully',
                'data' => $pelanggaran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllPelanggaran');
        }
    }
    public function getPelanggaranBySiswaId($id)
    {
        try {
            $pelanggaran = Pelanggaran::where('terlapor', $id)->get();
            if ($pelanggaran->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggaran not found'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggaran retrieved successfully',
                'data' => $pelanggaran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllPelanggaran');
        }
    }
    public function getPelanggaranByUserId($id)
    {
        try {
            $pelanggaran = Pelanggaran::where('pelapor', $id)->get();
            if ($pelanggaran->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggaran not found'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggaran retrieved successfully',
                'data' => $pelanggaran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllPelanggaran');
        }
    }
    public function createPelanggaran(Request $request)
    {
        try {
            $data = $request->except('bukti_gambar');

            $validationResult = $this->validation($request);
            if (!$validationResult) {
                return $validationResult;
            }

            if ($request->hasFile('bukti_gambar')) {
                $image = $request->file('bukti_gambar');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/pelanggaran', $imageName);
                $data['nama_foto'] = $imageName;  // Changed from foto_path to nama_foto
            }

            $pelanggaran = Pelanggaran::create($data);
            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggaran created successfully',
                'data' => $pelanggaran
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createPelanggaran');
        }
    }
    public function updatePelanggaran(Request $request, $id)
    {
        try {
            $data = $request->except('bukti_gambar');
            $validationResult = $this->validation($data, $id);
            if (!$validationResult) {
                return $validationResult;
            }

            $pelanggaran = Pelanggaran::find($id);
            if (!$pelanggaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggaran not found'
                ], 404);
            }

            if ($request->hasFile('bukti_gambar')) {
                // Delete old image if exists
                if ($pelanggaran->nama_foto) {
                    Storage::delete('public/pelanggaran/' . $pelanggaran->nama_foto);
                }

                $image = $request->file('bukti_gambar');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/pelanggaran', $imageName);
                $data['nama_foto'] = $imageName;
            }

            $pelanggaran->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggaran updated successfully',
                'data' => $pelanggaran
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updatePelanggaran');
        }
    }
    public function deletePelanggaran($id)
    {
        try {
            $pelanggaran = Pelanggaran::find($id);
            if (!$pelanggaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggaran not found'
                ], 404);
            }
            $pelanggaran->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully deleted schedule'
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllPelanggaran');
        }
    }

    private function validation($request, $id = null)
    {
        $validator = Validator::make($request, [
            'nama_pelanggaran' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'status' => 'required|in:pengajuan,ditolak,proses,selesai',
            'pelapor' => 'required|integer|exists:users,id',
            'terlapor' => 'required|integer|exists:siswa,id',
            'bukti_gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
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
