<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Privilege extends Model
{
    /** @use HasFactory<\Database\Factories\PrivilegesFactory> */
    use HasFactory;

    protected $fillable = [
        'id_user',
        'isSuperAdmin',
        'isAdmin',
        'isGuru',
        'isKonselor',
        'isSiswa',
    ];
}
