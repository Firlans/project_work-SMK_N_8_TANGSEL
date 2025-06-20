<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use App\Traits\ApiResponseHandler;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PrestasiController extends Controller
{
    use ApiResponseHandler;
    public function getAllPrestasi()
    {
        try {
            $prestasi = Prestasi::all();

            return $this->handleReturnData($prestasi, 'Prestasi');
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
                return $this->handleNotFoundData($id, 'Prestasi', 'ID');
            }

            return $this->handleReturnData($prestasi, 'Prestasi');
        } catch (\Exception $e) {
            return $this->handleError($e, 'getPrestasiById');
        }
    }

    public function getPrestasiByIdSiswa($id_siswa)
    {
        try {
            if (
                empty($id_siswa)
                || $id_siswa == null
                || $id_siswa == "null"
                || $id_siswa == "undefined"
                || !is_numeric($id_siswa)
            ) {
                return $this->invalidParameter($id_siswa);
            }

            $prestasi = Prestasi::where('siswa_id', '=', $id_siswa)->get();

            if (!$prestasi) {
                return $this->handleNotFoundData($id_siswa, 'Prestasi', 'id siswa');
            }

            return $this->handleReturnData($prestasi, 'Prestasi');
        } catch (Exception $e) {
            return
                $this->handleError($e, 'getPrestasiByIdSiswa');
        }
    }

    public function createPrestasi(Request $request)
    {
        try {
            $data = $request->except('bukti_gambar');

            $validationResult = $this->validation($data);
            if ($validationResult !== true) {
                return $validationResult;
            }

            if ($request->hasFile('bukti_gambar')) {
                $image = $request->file('bukti_gambar');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/prestasi', $imageName);
                $data['nama_foto'] = $imageName;
            }

            $prestasi = Prestasi::create($data);

            if (isset($data['status']) && $data['status'] === 'disetujui') {
                $siswa = Prestasi::select(
                    'siswa.nama_lengkap',
                    'users.email',
                    'wali_murid.email as email_orang_tua',
                    'wali_murid.nama_lengkap as nama_orang_tua'
                )
                    ->leftJoin('siswa', 'siswa.id', '=', 'prestasi.siswa_id')
                    ->leftJoin('wali_murid', 'wali_murid.id_siswa', '=', 'siswa.id')
                    ->leftJoin('users', 'users.id', '=', 'siswa.user_id')
                    ->where('prestasi.id', $prestasi->id)
                    ->first();

                if ($siswa) {
                    $parentName = $siswa->nama_orang_tua ?? 'Orang Tua/Wali';
                    $studentName = $siswa->nama_lengkap ?? '-';
                    $achievementDate = $prestasi->created_at->format('Y-m-d');
                    $achievementTitle = $prestasi->nama_prestasi ?? '-';
                    $description = $prestasi->deskripsi ?? '-';

                    Mail::to($siswa->email)
                        ->cc($siswa->email_orang_tua)
                        ->send(new \App\Mail\Prestasi(
                            $parentName,
                            $studentName,
                            $achievementDate,
                            $achievementTitle,
                            $description
                        ));

                } else {
                    \Log::warning("Data siswa tidak ditemukan untuk prestasi ID: {$prestasi->id}");
                }
            }

            return $this->handleCreated($prestasi, 'Prestasi');
        } catch (\Exception $e) {
            return $this->handleError($e, 'createPrestasi');
        }
    }

    public function updatePrestasi(Request $request, $id)
    {
        try {
            $data = $request->except('bukti_gambar');

            $validationResult = $this->validation($data, $id);
            if ($validationResult !== true) {
                return $validationResult;
            }

            $prestasi = Prestasi::find($id);
            if (!$prestasi) {
                return $this->handleNotFoundData($id, 'Prestasi', 'ID');
            }

            if ($request->hasFile('bukti_gambar')) {
                if ($prestasi->nama_foto) {
                    Storage::delete('public/prestasi/' . $prestasi->nama_foto);
                }
                $image = $request->file('bukti_gambar');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->storeAs('public/prestasi', $imageName);
                $data['nama_foto'] = $imageName;
            }

            $prestasi->update($data);
            if (isset($data['status']) && $data['status'] === 'disetujui') {
                $siswa = Prestasi::select([
                    'siswa.nama_lengkap',
                    'users.email',
                    'wali_murid.email as email_orang_tua',
                    'wali_murid.nama_lengkap as nama_orang_tua'
                ])
                    ->leftJoin('siswa', 'siswa.id', '=', 'prestasi.siswa_id')
                    ->leftJoin('wali_murid', 'wali_murid.id_siswa', '=', 'siswa.id')
                    ->leftJoin('users', 'users.id', '=', 'siswa.user_id')
                    ->where('prestasi.id', $prestasi->id)
                    ->first();

                if ($siswa) {
                    $parentName = $siswa->nama_orang_tua ?? 'Orang Tua/Wali';
                    $studentName = $siswa->nama_lengkap ?? '-';
                    $achievementDate = $prestasi->created_at->format('Y-m-d');
                    $achievementTitle = $prestasi->nama_prestasi ?? '-';
                    $description = $prestasi->deskripsi ?? '-';

                    \Mail::to($siswa->email)
                        ->cc($siswa->email_orang_tua)
                        ->send(new \App\Mail\Prestasi(
                            $parentName,
                            $studentName,
                            $achievementDate,
                            $achievementTitle,
                            $description
                        ));

                } else {
                    \Log::warning("Data siswa tidak ditemukan untuk prestasi ID: {$prestasi->id}");
                }
            }
            return $this->handleUpdated($prestasi, 'Prestasi');
        } catch (\Exception $e) {
            return $this->handleError($e, 'updatePrestasi');
        }
    }

    public function deletePrestasi($id)
    {
        try {
            $prestasi = Prestasi::find($id);
            if (!$prestasi) {
                return $this->handleNotFoundData($id, 'Prestasi', 'ID');
            }

            if ($prestasi->nama_foto) {
                Storage::delete('public/prestasi/' . $prestasi->nama_foto);
            }

            $prestasi->delete();

            return $this->handleDeleted('Prestasi');
        } catch (\Exception $e) {
            return $this->handleError($e, 'deletePrestasi');
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
            empty($data['siswa_id']) ||
            $data['siswa_id'] === null ||
            $data['siswa_id'] === "null" ||
            $data['siswa_id'] === "undefined" ||
            !is_numeric($data['siswa_id'])
        ) {
            return $this->invalidParameter("siswa id = {$data['siswa_id']}");
        }

        $validator = Validator::make($data, [
            'nama_prestasi' => 'required|string',
            'deskripsi' => 'required|string',
            'status' => 'nullable|in:pengajuan,ditolak,disetujui',
            'siswa_id' => 'required|exists:siswa,id',
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
