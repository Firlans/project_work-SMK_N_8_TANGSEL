<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use App\Models\Siswa;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use function PHPUnit\Framework\isNumeric;

class PrestasiController extends Controller
{
    use ApiResponseHandler;
    public function getAllPrestasi()
    {
        try {
            $prestasi = Prestasi::all();

            return $this->handleReturnData($prestasi);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllPrestasi');
        }
    }

    public function getPrestasiById($id)
    {
        try {
            if (
                empty($id)
                || $id == null
                || $id == "null"
                || $id == "undefined"
                || !is_numeric($id)
            ) {
                return $this->invalidParameter($id);
            }

            $prestasi = Prestasi::find($id);
            if (!$prestasi) {
                return $this->handleNotFoundData("Prestasi with ID $id not found");
            }

            return $this->handleReturnData($prestasi);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getPrestasiById');
        }
    }

    public function createPrestasi(Request $request)
    {
        try{
            $data = $request->except('bukti_gambar');
            $validationResult = $this->validation($data);
            if (!$validationResult) {
                return $validationResult;
            }

            if ($request->hasFile('bukti_gambar')) {
                $image = $request->file('bukti_gambar');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/prestasi', $imageName);
                $data['nama_foto'] = $imageName;
            }

            // $isExistSiswa = Siswa::find($data['siswa_id']);
            // if(!$isExistSiswa){
            //     return $this->handleNotFoundData("Student with id {$data['siswa_id']} not found");
            // }

            $prestasi = Prestasi::create($data);
            return $this->handleReturnData($prestasi);
        }catch(\Exception $e){
            return $this->handleError($e, 'createPrestasi');;
        }


    }

    private function validation($data)
    {
        $validator = Validator::make($data, [
            'nama_prestasi' => 'required|string',
            'deskripsi' => 'required|string',
            'status' => 'nullable|in:pengajuan,ditolak,disetujui',
            'siswa_id' => 'required|exists:siswa,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        return true;
    }
}
