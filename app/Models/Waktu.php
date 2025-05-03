<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Waktu extends Model
{
    /** @use HasFactory<\Database\Factories\WaktuFactory> */
    use HasFactory;

    protected $table = 'waktu';
    protected $fillable = [
        'jam_mulai',
        'jam_selesai'
    ];
}
