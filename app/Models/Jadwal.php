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
        'id_mata_pelajaran', // This matches the database column
        'hari_id',
        'jam_mulai',
        'jam_selesai'
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id');
    }

    public function mataPelajaran()
    {
        // Fix: Change foreign key to match database column
        return $this->belongsTo(MataPelajaran::class, 'id_mata_pelajaran', 'id');
    }
}
