<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AbsenController;
use App\Http\Controllers\ConselorController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MataPelajaranController;
use App\Http\Controllers\PelanggaranController;
use App\Http\Controllers\PertemuanController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WaktuController;
use App\Http\Controllers\WaliMuridController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\SiswaMiddleware;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware([JwtMiddleware::class])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::middleware([RoleMiddleware::class])->group(function () {
        Route::get('/profile', function () { });
    });
    Route::middleware([SiswaMiddleware::class])->group(function () {


    });
});
// route absen
Route::get('/absen', [AbsenController::class, 'getAllKehadiran']);
Route::get('/absen/siswa', [AbsenController::class, 'getKehadiranBySiswaId']);
Route::get('/absen/mata-pelajaran', [AbsenController::class, 'getKehadiranByIdSiswaAndMataPelajaran']);
Route::get('/absen/kelas', [AbsenController::class, 'getKehadiranByIdSiswaAndKelasId']);
Route::get('/absen/pertemuan/{id_pertemuan}', [AbsenController::class, 'getKehadiranByIdPertemuan']);
Route::get('/absen/pertemuan', [AbsenController::class, 'getKehadiranByIdSiswaAndIdPertemuan']);
Route::post('/absen', [AbsenController::class, 'createKehadiran']);
Route::put('/absen/{id_kelas}', [AbsenController::class, 'updateKehadiran']);
Route::delete('/absen/{id_kelas}', [AbsenController::class, 'deleteKehadiran']);

// route mata_pelajaran
Route::get('/mata-pelajaran', [MataPelajaranController::class, 'getAllMataPelajaran']);
Route::post('/mata-pelajaran', [MataPelajaranController::class, 'createMataPelajaran']);
Route::put("/mata-pelajaran/{id_mata_pelajaran}", [MataPelajaranController::class, 'updateMataPelajaran']);
Route::delete("/mata-pelajaran/{id_mata_pelajaran}", [MataPelajaranController::class, 'deleteMataPelajaran']);

// route jadwal
Route::get('/jadwal', [JadwalController::class, 'getAllJadwal']);
Route::get('/jadwal/{id_jadwal}', [JadwalController::class, 'getJadwalById']);
Route::get('/jadwal/siswa', [JadwalController::class, 'getJadwalBySiswa']);
Route::get('/jadwal/mata-pelajaran', [JadwalController::class, 'getJadwalBySiswaMapel']);
Route::get('/jadwal/hari', [JadwalController::class, 'getJadwalBySiswaHari']);
Route::get('/jadwal/guru/{id_guru}', [JadwalController::class, 'getJadwalByGuruId']);
Route::post('/jadwal', [JadwalController::class, 'createJadwal']);
Route::put('/jadwal/{id_jadwal}', [JadwalController::class, 'updateJadwal']);
Route::delete('/jadwal/{id_jadwal}', [JadwalController::class, 'deleteJadwal']);

// route pertemuan
Route::get('/pertemuan',[PertemuanController::class, 'getAllPertemuan']);
Route::get('/pertemuan/{id}',[PertemuanController::class, 'getPertemuanById']);
Route::get('/pertemuan/jadwal/{idJadwal}',[PertemuanController::class, 'getPertemuanByJadwalId']);
Route::post('/pertemuan',[PertemuanController::class, 'createPertemuan']);
Route::put('/pertemuan/{id}',[PertemuanController::class, 'updatePertemuan']);
Route::delete('/pertemuan/{id}',[PertemuanController::class, 'deletePertemuan']);

// route kelas
Route::get('/kelas', [KelasController::class, 'getAllKelas']);
Route::get('/kelas/{id_kelas}', [KelasController::class, 'getKelasById']); // Add this new route
Route::post('/kelas', [KelasController::class, 'createKelas']);
Route::put('/kelas/{id_kelas}', [KelasController::class, 'updateKelas']);
Route::delete('/kelas/{id_kelas}', [KelasController::class, 'deleteKelas']);

// route user
Route::get('user', [UserController::class, 'getAllUser']);
Route::get('user/{id}', [UserController::class, 'getUserById']);
Route::post('user', [UserController::class, 'createUser']);
Route::put('user/{id}', [UserController::class, 'updateUser']);
Route::delete('user/{id}', [UserController::class, 'deleteUser']);

// route siswa
Route::get('/siswa', [SiswaController::class, 'getAllSiswa']);
Route::get('/siswa/{id}', [SiswaController::class, 'getSiswaById']);
Route::put('/siswa/{id}', [SiswaController::class, 'updateSiswa']);
Route::delete('/siswa/{id}', [SiswaController::class, 'deleteSiswa']);

// route admin
Route::get('/admin', [AdminController::class, 'getAllAdmin']);
Route::get('/admin/{id_admin}', [AdminController::class, 'getAdminById']);
Route::put('/admin/{id_admin}', [AdminController::class, 'updateAdmin']);

// route guru
Route::get('/guru', [GuruController::class, 'getAllGuru']);
Route::get('/guru/{id}', [GuruController::class, 'getGuruById']);
Route::get('/guru/mata-pelajaran/{id}', [GuruController::class, 'getGuruByMataPelajaranId']);
Route::put('/guru/{id}', [GuruController::class, 'updateGuru']);
Route::delete('/guru/{id}', [GuruController::class, 'deleteGuru']);

// route konselor
Route::get('/konselor', [ConselorController::class, 'getAllConselor']);
Route::get('/konselor/{id}', [ConselorController::class, 'getConselorById']);
Route::put('/konselor/{id}', [ConselorController::class, 'updateConselor']);

// route orang tua
Route::get('/wali-murid', [WaliMuridController::class, 'getAllWaliMurid']);
Route::get('/wali-murid/{id}', [WaliMuridController::class, 'getWaliMuridById']);
Route::get('/wali-murid/siswa/{id_siswa}', [WaliMuridController::class, 'getWaliMuridBySiswaId']); // Changed route and method name
Route::post('/wali-murid', [WaliMuridController::class, 'createWaliMurid']);
Route::put('/wali-murid/{id}', [WaliMuridController::class, 'updateWaliMurid']);
Route::delete('/wali-murid/{id}', [WaliMuridController::class, 'deleteWaliMurid']);

// route pelanggaran
Route::get('/pelanggaran', [PelanggaranController::class, 'getAllPelanggaran']);
Route::get('/pelanggaran/{id}', [PelanggaranController::class, 'getPelanggaranById']);
Route::get('/pelanggaran/pelapor/{user_id}', [PelanggaranController::class, 'getPelanggaranByUserId']);
Route::get('/pelanggaran/terlapor/{id_siswa}', [PelanggaranController::class, 'getPelanggaranBySiswaId']);
Route::post('/pelanggaran', [PelanggaranController::class, 'createPelanggaran']);
Route::put('/pelanggaran/{id}', [PelanggaranController::class, 'updatePelanggaran']);
Route::delete('/pelanggaran/{id}', [PelanggaranController::class, 'deletePelanggaran']);

// // route prestasi
Route::get('/prestasi', [PrestasiController::class, 'getAllPrestasi']);
Route::get('/prestasi/{id}', [PrestasiController::class, 'getPrestasiById']);
Route::post('/prestasi', [PrestasiController::class, 'createPrestasi']);
Route::put('/prestasi/{id}', [PrestasiController::class, 'updatePrestasi']);
Route::delete('/prestasi/{id}', [PrestasiController::class, 'deletePrestasi']);

// route waktu
Route::post('/waktu', [WaktuController::class, 'createWaktu']);
Route::put('/waktu/{id}', [WaktuController::class, 'updateWaktu']);
Route::delete('/waktu/{id}', [WaktuController::class, 'deleteWaktu']);
Route::get('/waktu', [WaktuController::class, 'getAllWaktu']);