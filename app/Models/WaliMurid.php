<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaliMurid extends Model
{
    /** @use HasFactory<\Database\Factories\OrangTuaFactory> */
    use HasFactory;

    protected $table = 'wali_murid';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id_siswa',
        'nama_lengkap',
        'no_telp',
        'email',
        'alamat',
        'status'
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'id_siswa');
    }
}
