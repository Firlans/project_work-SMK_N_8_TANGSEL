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
        'is_superadmin',
        'is_admin',
        'is_guru',
        'is_conselor',
        'is_siswa',
    ];
}
