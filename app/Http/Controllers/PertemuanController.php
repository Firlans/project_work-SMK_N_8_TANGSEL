<?php

namespace App\Http\Controllers;

use App\Models\Pertemuan;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PertemuanController extends Controller
{
    use ApiResponseHandler;

    public function getAllPertemuan()
    {
        try {
            $pertemuan = Pertemuan::all();

            return $this->handleReturnData($pertemuan, 'Pertemuan');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllPertemuann');
        }
    }

    public function getPertemuanById($id)
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

            $pertemuan = Pertemuan::find($id);

            if (!$pertemuan) {
                return $this->handleNotFoundData($id, 'Pertemuan', 'ID');
            }

            return $this->handleReturnData($pertemuan, 'Pertemuan');

        } catch (\Exception $e) {
            return $this->handleError($e, 'getPertemuanById');
        }
    }

    public function getPertemuanByJadwalId($idJadwal)
    {
        try {
            if (
                empty($idJadwal)
                || $idJadwal == null
                || $idJadwal == "null"
                || $idJadwal == "undefined"
                || !is_numeric($idJadwal)
            ) {
                return $this->invalidParameter($idJadwal);
            }

            $pertemuan = Pertemuan::select('pertemuan.*')
                ->join('jadwal', 'jadwal.id', '=', 'pertemuan.id_jadwal')
                ->where('jadwal.id', '=', $idJadwal)
                ->get();

            if ($pertemuan->isEmpty()) {
                return $this->handleNotFoundData($idJadwal, 'Pertemuan', 'id jadwal');
            }

            return $this->handleReturnData($pertemuan, 'Pertemuan');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getPertemuanByJadwalId');
        }
    }

    public function createPertemuan(Request $request)
    {
        try {
            $data = $request->all();
            $validationResult = $this->validation($data);
            if($validationResult !== true){
                return $validationResult;
            }

            $pertemuan = Pertemuan::create($data);
            return $this->handleCreated($pertemuan, 'Pertemuan');
        } catch (\Exception $e) {
            return $this->handleError($e, 'createPertemuan');
        }
    }

    public function updatePertemuan(Request $request, $id){
        try{
            $data = $request->all();
            $validationResult = $this->validation($data, $id);
            if($validationResult !== true){
                return $validationResult;
            }
            $pertemuan = Pertemuan::find($id);
            if(!$pertemuan){
                return $this->handleNotFoundData($id, 'Pertemuan');
            }

            $pertemuan->update($data);

            return $this->handleUpdated($pertemuan, 'Pertemuan');
        }catch (\Exception $e) {
            return $this->handleError($e, 'updatePertemuan');
        }
    }

    public function deletePertemuan($id){
        try{
            if (
                empty($id)
                || $id == null
                || $id == "null"
                || $id == "undefined"
                || !is_numeric($id)
            ) {
                return $this->invalidParameter($id);
            }

            $pertemuan = Pertemuan::find($id);
            if(!$pertemuan){
                return $this->handleNotFoundData($id, 'Pertemuan');
            }
            $pertemuan->delete();
            \Log::info('delete info'. $pertemuan);
            return $this->handleDeleted('Pertemuan');
        }catch (\Exception $e) {
            return $this->handleError($e, 'deletePertemuan');
        }
    }

    private function validation($data, $id = null)
    {
        if (
            isset($id) &&
            (
                empty($id) ||
                $id === null ||
                $id === "null" ||
                $id === "undefined" ||
                !is_numeric($id)
            )
        ) {
            return $this->invalidParameter("id = {$id}");
        }

        if (
            empty($data['id_jadwal'])
            || $data['id_jadwal'] == null
            || $data['id_jadwal'] == "null"
            || $data['id_jadwal'] == "undefined"
            || !is_numeric($data['id_jadwal'])
        ) {
            return $this->invalidParameter("id_jadwal = {$data['id_jadwal']}");
        }

        $validator = Validator::make($data, [
            'nama_pertemuan' => 'nullable|string',
            'id_jadwal' => 'required|exists:jadwal,id',
            'tanggal' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        return true;
    }
}
