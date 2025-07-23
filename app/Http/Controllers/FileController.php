<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;

class FileController extends Controller
{
    use ApiResponseHandler;
    public function getBuktiPrestesi($nama_foto)
    {
        try {
            $path = 'public/prestasi/' . $nama_foto;
            if (!Storage::disk('local')->exists($path)) {
                return $this->handleNotFoundData($nama_foto, 'bukti prestasi', 'nama foto');
            }

            $file = Storage::disk('local')->get($path);
            $mimeType = Storage::mimeType($path);

            return response($file, 200)->header('Content-Type', $mimeType);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getBuktiPrestasi');
        }
    }
    public function getBuktiPelanggaran($nama_foto)
    {
        try {
            $path = 'public/pelanggaran/' . $nama_foto;
            if (!Storage::disk('local')->exists($path)) {
                return $this->handleNotFoundData($nama_foto, 'bukti pelanggaran', 'nama foto');
            }

            $file = Storage::disk('local')->get($path);
            $mimeType = Storage::mimeType($path);

            return response($file, 200)->header('Content-Type', $mimeType);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getBuktiPelanggaran');
        }
    }

    public function getFile($nama_file)
    {
        try {
            $path = 'public/files/' . $nama_file;
            if (!Storage::disk('local')->exists($path)) {
                return $this->handleNotFoundData($nama_file, 'file', 'nama file');
            }

            $file = Storage::disk('local')->get($path);
            $mimeType = Storage::mimeType($path);

            return response($file, 200)->header('Content-Type', $mimeType);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getFile');
        }
    }

    public function saveFile(Request $request)
    {
        try {
            $validation = Validator::make($request->all(), [
                'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf|max:20480', // max 20MB
            ]);

            if ($validation->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validation->errors(),
                ], 422);
            }

            $file = $request->file('file');
            $path = 'public/files/' . $file->getClientOriginalName();
            Storage::disk('local')->put($path, file_get_contents($file));

            return $this->handleReturnData(['path' => $path], 'file');
        } catch (\Exception $e) {
            return $this->handleError($e, 'saveFile');
        }
    }
}
