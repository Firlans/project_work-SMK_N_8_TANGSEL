<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    /** @use HasFactory<\Database\Factories\MataPelajaranFactory> */
    use HasFactory;

    protected $table = 'mata_pelajaran';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_pelajaran'
    ];
}
