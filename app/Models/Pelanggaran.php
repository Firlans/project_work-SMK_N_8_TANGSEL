<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pelanggaran extends Model
{
    protected $table = 'pelanggaran';

    protected $fillable = [
        'nama_pelanggaran',
        'foto_path',
        'deskripsi',
        'status',
        'pelapor',
        'terlapor'
    ];

    public function pelaporUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pelapor');
    }

    public function terlaporSiswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class, 'terlapor');
    }
}
