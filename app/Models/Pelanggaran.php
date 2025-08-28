<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pelanggaran extends Model
{
    use HasFactory;

    protected $table = 'pelanggaran';

    protected $fillable = [
        'nama_pelanggaran',
        'jenis_pelanggaran_id',
        'nama_foto',
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

    public function jenisPelanggaran()
    {
        return $this->belongsTo(JenisPelanggaran::class, 'jenis_pelanggaran_id');
    }
}
