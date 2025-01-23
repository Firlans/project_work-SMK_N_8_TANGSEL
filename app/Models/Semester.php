<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    /** @use HasFactory<\Database\Factories\SemesterFactory> */
    use HasFactory;

    protected $table = 'semester';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_semester',
        'status'
    ];
}
