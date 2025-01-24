<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatDetail extends Model
{
    /** @use HasFactory<\Database\Factories\ChatDetailFactory> */
    use HasFactory;
    protected $table = 'chat_details';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id_chat_room',
        'message',
        'sender_id',
        'sender_type'
    ];

    public function chatRoom()
    {
        return $this->belongsTo(ChatRoom::class, 'id_chat_room', 'id');
    }

    /**
     * Relasi polimorfik ke model pengirim (Siswa/Guru).
     */
    public function sender()
    {
        return $this->morphTo();
    }
}
