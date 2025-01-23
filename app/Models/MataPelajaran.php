<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    /** @use HasFactory<\Database\Factories\MataPelajaranFactory> */
    use HasFactory;

    protected $table = 'mata_pelajaran';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_pelajaran',
        'id_guru'
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'id_guru', 'id');
    }

    public function kehadiran()
    {
        return $this->hasMany(Kehadiran::class, 'mata_pelajaran_id', 'id');
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'mata_pelajaran_id', 'id');
    }
}
