<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kehadiran;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\KehadiranResource;

class AbsenController extends Controller
{

    public function getAllKehadiran()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran', 'siswa'])->get();

            return response()->json([
                'status' => 'success',
                'data' => $this->groupKehadiranBySiswa($kehadiran)
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getAllKehadiran');
        }
    }

    public function getKehadiranBySiswaId(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_siswa = $request->query('id_siswa');

            if (!$id_siswa) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'id unknown'
                ], 400);
            }

            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran', 'siswa'])
                ->where('id_siswa', $id_siswa)
                ->get();

            return $this->handleResponse($kehadiran);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiran');
        }
    }

    public function getKehadiranByMataPelajaran(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $id_mata_pelajaran = $request->query('id_mata_pelajaran');

            if (!$id_mata_pelajaran) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'id_mata_pelajaran is required'
                ], 400);
            }

            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran', 'siswa'])
                ->whereHas('jadwal', function($query) use ($id_mata_pelajaran) {
                    $query->where('id_mata_pelajaran', $id_mata_pelajaran);
                })
                ->get();

                return response()->json([
                'status' => 'success',
                'data' => $this->groupKehadiranByKelas($kehadiran),
                'message' => $kehadiran->isEmpty() ? 'No attendance records found' : null
            ], 200);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiranByMataPelajaran');
        }
    }

    public function getKehadiranByKelasId($id)
    {
        try {
            $kehadiran = Kehadiran::with(['jadwal.mataPelajaran', 'siswa'])
                ->whereHas('jadwal', function($query) use ($id) {
                    $query->where('id_kelas', $id);
                })
                ->get();

            return $this->handleResponse($kehadiran);
        } catch (\Exception $e) {
            return $this->handleError($e, 'getKehadiranByKelasId');
        }
    }

    private function handleResponse($data, $message = null)
    {
        return response()->json([
            'status' => 'success',
            'data' => $this->groupKehadiranByJadwal($data),
            'message' => $message
        ], 200);
    }

    private function handleError(\Exception $e, $context)
    {
        Log::error("Error in {$context}:", [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'status' => 'error',
            'message' => 'Failed to fetch attendance data',
            'debug' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }

    private function groupKehadiranByJadwal($kehadiran)
    {
        return $kehadiran->groupBy('jadwal.id')->map(function ($group) {
            $jadwal = $group->first()->jadwal;
            return [
                'jadwal' => [
                    'id' => $jadwal->id,
                    'id_kelas' => $jadwal->id_kelas,
                    'hari_id' => $jadwal->hari_id,
                    'jam_mulai' => $jadwal->jam_mulai,
                    'jam_selesai' => $jadwal->jam_selesai,
                    'mata_pelajaran' => [
                        'id' => $jadwal->mataPelajaran->id,
                        'nama_pelajaran' => $jadwal->mataPelajaran->nama_pelajaran,
                    ],
                ],
                'absensi' => $group->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'id_siswa' => $item->id_siswa,
                        'tanggal' => $item->tanggal,
                        'status' => $item->status,
                        'keterangan' => $item->keterangan,
                        'siswa' => $item->siswa ? [
                            'id' => $item->siswa->id,
                            'nama' => $item->siswa->nama,
                        ] : null,
                    ];
                })->values(),
            ];
        })->values();
    }
    private function groupKehadiranBySiswa($kehadiran)
    {
        return $kehadiran->groupBy('id_siswa')->map(function ($group) {
            $firstRecord = $group->first();
            return [
                'siswa' => $firstRecord->siswa ? [
                    'id' => $firstRecord->siswa->id,
                    'nama' => $firstRecord->siswa->nama,
                ] : null,
                'kehadiran' => $group->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'tanggal' => $item->tanggal,
                        'status' => $item->status,
                        'keterangan' => $item->keterangan,
                        'jadwal' => [
                            'id' => $item->jadwal->id,
                            'id_kelas' => $item->jadwal->id_kelas,
                            'hari_id' => $item->jadwal->hari_id,
                            'jam_mulai' => $item->jadwal->jam_mulai,
                            'jam_selesai' => $item->jadwal->jam_selesai,
                            'mata_pelajaran' => [
                                'id' => $item->jadwal->mataPelajaran->id,
                                'nama_pelajaran' => $item->jadwal->mataPelajaran->nama_pelajaran,
                            ],
                        ],
                    ];
                })->values(),
            ];
        })->values();
    }

    private function groupKehadiranByKelas($kehadiran)
    {
        return $kehadiran->groupBy('jadwal.id_kelas')->map(function ($kelasGroup) {
            $firstRecord = $kelasGroup->first();
            return [
                'kelas' => [
                    'id' => $firstRecord->jadwal->id_kelas,
                    'mata_pelajaran' => [
                        'id' => $firstRecord->jadwal->mataPelajaran->id,
                        'nama_pelajaran' => $firstRecord->jadwal->mataPelajaran->nama_pelajaran,
                    ],
                ],
                'jadwal' => [
                    'id' => $firstRecord->jadwal->id,
                    'hari_id' => $firstRecord->jadwal->hari_id,
                    'jam_mulai' => $firstRecord->jadwal->jam_mulai,
                    'jam_selesai' => $firstRecord->jadwal->jam_selesai,
                ],
                'kehadiran' => $kelasGroup->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'tanggal' => $item->tanggal,
                        'status' => $item->status,
                        'keterangan' => $item->keterangan,
                        'siswa' => $item->siswa ? [
                            'id' => $item->siswa->id,
                            'nama' => $item->siswa->nama,
                        ] : null,
                    ];
                })->values(),
            ];
        })->values();
    }
}
