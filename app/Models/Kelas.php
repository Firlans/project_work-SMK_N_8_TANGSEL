<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    /** @use HasFactory<\Database\Factories\KelasFactory> */
    use HasFactory;

    protected $table = 'kelas';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_kelas',
        'tingkat',
        'ketua_kelas'
    ];

    public function ketua()
    {
        return $this->belongsTo(Siswa::class, 'ketua_kelas', 'id');
    }

    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'id_kelas', 'id');
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'id_kelas', 'id');
    }
}
