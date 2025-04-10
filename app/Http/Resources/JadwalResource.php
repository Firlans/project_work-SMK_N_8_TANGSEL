<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JadwalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'id_kelas' => $this->id_kelas,
            'hari_id' => $this->hari_id,
            'jam_mulai' => $this->jam_mulai,
            'jam_selesai' => $this->jam_selesai,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'mata_pelajaran' => new MataPelajaranResource($this->whenLoaded('mataPelajaran')),
        ];
    }
}
