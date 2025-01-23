<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrangTua extends Model
{
    /** @use HasFactory<\Database\Factories\OrangTuaFactory> */
    use HasFactory;

    protected $table = 'orang_tua';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_lengkap',
        'no_telp',
        'email',
        'alamat'
    ];
}
