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
        'user_id',
        'nama_lengkap',
        'jenis_kelamin',
        'tanggal_lahir',
        'alamat',
        'no_telp',
        'nisn',
        'nis',
        'id_semester',
        'id_kelas'
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'id_semester');
    }

    public function waliMurid()
    {
        return $this->hasOne(WaliMurid::class, 'id_siswa');
    }

    public function sentMessages()
    {
        return $this->morphMany(ChatDetail::class, 'sender');
    }
}
