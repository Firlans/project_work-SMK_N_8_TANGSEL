<?php

namespace App\Http\Controllers;

use App\Models\JenisPelanggaran;
use App\Traits\ApiResponseHandler;
use Illuminate\Http\Request;

class JenisPelanggaranController extends Controller
{
    use ApiResponseHandler;
    public function getAllJenisPelanggaran()
    {
        try {
            $jadwal = JenisPelanggaran::all();

            return $this->handleReturnData($jadwal, 'Jenis Pelanggarn');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllJenisPelanggaran');
        }
    }
}
