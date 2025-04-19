<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kehadiran extends Model
{
    /** @use HasFactory<\Database\Factories\KehadiranFactory> */
    use HasFactory;

    protected $table = 'kehadiran';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id_siswa',
        'tanggal',
        'status',
        'jadwal_id',
        'keterangan'
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'id_siswa', 'id');
    }

    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class, 'jadwal_id');
    }
}