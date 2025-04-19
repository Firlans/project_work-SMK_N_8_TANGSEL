<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    /** @use HasFactory<\Database\Factories\JadwalFactory> */
    use HasFactory;

    protected $table = 'jadwal';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id_kelas',
        'id_mata_pelajaran',
        'id_hari',
        'jam_mulai',
        'jam_selesai'
    ];

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class, 'id_mata_pelajaran', 'id');
    }

    public function kehadiran()
    {
        return $this->hasMany(Kehadiran::class, 'id_jadwal', 'id');
    }
}
