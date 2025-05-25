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
        'user_id',
        'nama',
        'tanggal_lahir',
        'alamat',
        'no_telp',
        'jenis_kelamin',
        'nip'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class, 'id_guru', 'id');
    }

    public function sentMessages()
    {
        return $this->morphMany(ChatDetail::class, 'sender');
    }
}
