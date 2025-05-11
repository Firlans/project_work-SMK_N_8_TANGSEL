<?php

namespace App\Http\Controllers;

use App\Models\Waktu;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WaktuController extends Controller
{
    use ApiResponseHandler;

    public function createWaktu(Request $request)
    {
        try {
            $data = $request->all();
            $validationResult = $this->validation($data);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $waktu = Waktu::create($data);

            return $this->handleCreated($waktu, 'Waktu');
        } catch (\Exception $e) {
            return $this->handleError($e, 'createWaktu');
        }
    }

    public function updateWaktu(Request $request, $id)
    {
        try {
            $data = $request->all();

            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $waktu = Waktu::find($id);
            if (!$waktu) {
                return $this->handleNotFoundData($id, 'Waktu');
            }

            $waktu->update($data);

            return $this->handleUpdated($waktu, 'Waktu');

        } catch (\Exception $e) {
            return $this->handleError($e, 'updateWaktu');
        }

    }

    public function deleteWaktu($id)
    {
        try {
            $waktu = Waktu::find($id);
            if (!$waktu) {
                return $this->handleNotFoundData($id, 'Waktu');
            }

            $waktu->delete();

            return $this->handleDeleted('Waktu');

        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteWaktu');
        }
    }

    public function getAllWaktu()
    {
        try {
            $waktu = Waktu::all();

            return $this->handleReturnData($waktu, 'Waktu');
        } catch (\Exception $e) {
            return $this->handleError($e, 'createWaktu');
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

        $validator = Validator::make($data, [
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after_or_equal:jam_mulai'
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
