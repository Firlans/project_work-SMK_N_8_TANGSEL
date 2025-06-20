<?php

namespace App\Http\Controllers;

use App\Models\Pelanggaran;
use App\Traits\ApiResponseHandler;
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
            $validationResult = $this->validation($data);
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
            $pelanggaran = Pelanggaran::find($id);
            if (!$pelanggaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggaran not found'
                ], 404);
            }

            // Handle both form-data and raw JSON
            $data = $request->isJson() ? $request->json()->all() : $request->all();
            $data = array_filter($data, function ($key) {
                return !in_array($key, ['bukti_gambar', '_method']);
            }, ARRAY_FILTER_USE_KEY);

            // Validate the data
            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            // Handle image upload if exists
            if ($request->hasFile('bukti_gambar')) {
                if ($pelanggaran->nama_foto) {
                    Storage::delete('public/pelanggaran/' . $pelanggaran->nama_foto);
                }
                $image = $request->file('bukti_gambar');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/pelanggaran', $imageName);
                $data['nama_foto'] = $imageName;
            }

            // Update pelanggaran
            $pelanggaran->update($data);

            if (isset($data['status']) && $data['status'] === 'proses') {
                $siswa = Pelanggaran::select()
                    ->leftJoin('siswa', 'siswa.id', '=', 'pelanggaran.terlapor')
                    ->leftJoin('wali_murid', 'wali_murid.id_siswa', '=', 'siswa.id')
                    ->leftJoin('users', 'users.id', '=', 'siswa.user_id')
                    ->where('pelanggaran.id', $pelanggaran->id)
                    ->first([
                        'siswa.nama_lengkap',
                        'users.email',
                        'wali_murid.email as email_orang_tua',
                        'wali_murid.nama_lengkap as nama_orang_tua'
                    ]);
                if ($siswa) {
                    $parentName = $siswa->nama_orang_tua ?? 'Orang Tua/Wali';
                    $studentName = $siswa->nama_lengkap ?? '-';
                    $violationDate = $pelanggaran->created_at->format('Y-m-d');
                    $violationTitle = $pelanggaran->nama_pelanggaran ?? '-';
                    $description = $pelanggaran->deskripsi ?? '-';

                    \Mail::to($siswa->email)
                        ->cc($siswa->email_orang_tua)
                        ->send(new \App\Mail\Pelanggaran(
                            $parentName,
                            $studentName,
                            $violationDate,
                            $violationTitle,
                            $description
                        ));
                }
            }

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

            // Delete associated image if exists
            if ($pelanggaran->nama_foto) {
                Storage::delete('public/pelanggaran/' . $pelanggaran->nama_foto);
            }

            $pelanggaran->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully deleted pelanggaran'
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deletePelanggaran');
        }
    }

    private function validation($data, $id = null)
    {
        $rules = [
            'nama_pelanggaran' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'status' => 'required|in:pengajuan,ditolak,proses,selesai',
            'pelapor' => 'required|integer|exists:users,id',
            'terlapor' => 'required|integer|exists:siswa,id'
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
