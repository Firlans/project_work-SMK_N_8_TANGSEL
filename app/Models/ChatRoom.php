<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    /** @use HasFactory<\Database\Factories\ChatFactory> */
    use HasFactory;

    protected $table = 'chat_rooms';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'id_user_siswa',
        'id_user_guru',
        'access_code',
        'status',
        'is_private'
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'id_siswa', 'id');
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'id_guru', 'id');
    }

    public function chatDetails()
    {
        return $this->hasMany(ChatDetail::class, 'id_chat_room', 'id');
    }
}
