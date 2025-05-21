<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuruResource extends JsonResource
{
    public static function grouping($guru)
    {
        return $guru->groupBy('id')->map(function ($items) {
            $guru = $items->first(); // Ambil data guru (kolom non-pelajaran)

            return [
                'id' => $guru->id,
                'user_id' => $guru->user_id,
                'nama' => $guru->nama,
                'tanggal_lahir' => $guru->tanggal_lahir,
                'alamat' => $guru->alamat,
                'no_telp' => $guru->no_telp,
                'jenis_kelamin' => $guru->jenis_kelamin,
                'nip' => $guru->nip,
                'created_at' => $guru->created_at,
                'updated_at' => $guru->updated_at,
                'nama_pelajaran' => $items->pluck('nama_pelajaran')->unique()->values(), // jadi array
            ];
        })->values();
    }
}
