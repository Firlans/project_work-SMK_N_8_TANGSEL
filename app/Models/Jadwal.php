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
        'id_guru',
        'id_hari',
        'id_waktu'
    ];

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'id_guru', 'id');
    }

    public function pertemuan()
    {
        return $this->hasMany(Pertemuan::class, 'id_jadwal', 'id');
    }
    public function hari(){
        return $this->belongsTo(Hari::class, 'id_hari', 'id');
    }
    public function waktu()
    {
        return $this->belongsTo(Waktu::class, 'id_waktu', 'id');
    }
}
