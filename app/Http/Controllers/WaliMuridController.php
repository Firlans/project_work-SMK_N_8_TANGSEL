<?php

namespace App\Http\Controllers;

use App\Models\WaliMurid;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WaliMuridController extends Controller
{
    use ApiResponseHandler;

    public function getAllWaliMurid(Request $request)
    {
        try {
            $waliMurid = WaliMurid::all();

            return response()->json([
                'status' => 'success',
                'message' => $waliMurid->isEmpty() ? 'No wali murid found' : 'Wali murid retrieved successfully',
                'data' => $waliMurid
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllWaliMurid');
        }
    }

    public function getWaliMuridById($id)
    {
        try {
            $waliMurid = WaliMurid::where('id', $id)->first();

            if (!$waliMurid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Wali murid not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Wali murid retrieved successfully',
                'data' => $waliMurid
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getWaliMuridById');
        }
    }

    public function getWaliMuridBySiswaId($id)
    {
        try {
            $waliMurid = WaliMurid::where('id_siswa', $id)->get(); // Changed from first() to get()

            if ($waliMurid->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Wali murid not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Wali murid retrieved successfully',
                'data' => $waliMurid
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getWaliMuridBySiswaId');
        }
    }

    public function createWaliMurid(Request $request)
    {
        try {
            $data = $request->all();
            $validationResult = $this->validation($data);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $waliMurid = WaliMurid::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Wali murid created successfully',
                'data' => $waliMurid
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'createWaliMurid');
        }
    }

    public function updateWaliMurid(Request $request, $id)
    {
        try {
            $waliMurid = WaliMurid::find($id);

            if (!$waliMurid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Wali murid not found'
                ], 404);
            }

            $data = $request->all();
            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $waliMurid->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Wali murid updated successfully',
                'data' => $waliMurid
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'updateWaliMurid');
        }
    }

    public function deleteWaliMurid($id)
    {
        try {
            $waliMurid = WaliMurid::find($id);

            if (!$waliMurid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Wali murid not found'
                ], 404);
            }

            $waliMurid->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Wali murid deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'deleteWaliMurid');
        }
    }

    public function validation($data, $id = null)
    {
        $emailRule = 'required|email';
        $noTelpRule = 'required|string|max:15';

        // Add unique rule except for current record during updates
        if (!$id) {
            $emailRule .= '|unique:wali_murid,email';
            $noTelpRule .= '|unique:wali_murid,no_telp';
        } else {
            $emailRule .= '|unique:wali_murid,email,' . $id;
            $noTelpRule .= '|unique:wali_murid,no_telp,' . $id;
        }

        $validator = Validator::make($data, [
            'id_siswa' => 'required|exists:siswa,id',
            'nama_lengkap' => 'required|string|max:255',
            'no_telp' => $noTelpRule,
            'email' => $emailRule,
            'status' => 'required|in:ayah,ibu,wali murid',
            'alamat' => 'required|string'
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
