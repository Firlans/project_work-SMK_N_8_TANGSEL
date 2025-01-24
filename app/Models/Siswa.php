<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    /** @use HasFactory<\Database\Factories\SiswaFactory> */
    use HasFactory;
    protected $table = 'siswa';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_lengkap',
        'jenis_kelamin',
        'tanggal_lahir',
        'alamat',
        'no_telp',
        'nisn',
        'nis',
        'is_active',
        'id_kelas'
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id');
    }

    public function sentMessages()
    {
        return $this->morphMany(ChatDetail::class, 'sender');
    }
}
