<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('room.{roomId}', function ($user, $roomId) {
    // Sementara return true dulu buat test
    return true;

    // Nanti bisa diganti validasi:
    // return ChatRoom::where('id', $roomId)->where(function ($q) use ($user) {
    //     $q->where('id_siswa', $user->id)->orWhere('id_guru', $user->id);
    // })->exists();
});
