<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
}
