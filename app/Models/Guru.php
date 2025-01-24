<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    /** @use HasFactory<\Database\Factories\GuruFactory> */
    use HasFactory;
    protected $table = 'guru';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_lengkap',
        'jenis_kelamin',
        'nip',
        'role',
        'is_active'
    ];

    public function mataPelajaran()
    {
        return $this->hasMany(MataPelajaran::class, 'id_guru', 'id');
    }

    public function sentMessages()
    {
        return $this->morphMany(ChatDetail::class, 'sender');
    }
}
