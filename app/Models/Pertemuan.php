<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pertemuan extends Model
{
    protected $table = 'pertemuan';
    protected $fillable = [
        "id_jadwal",
        "tanggal"
    ];

    public function kehadiran(){
        return $this->hasMany(Kehadiran::class, 'id_pertemuan', 'id');
    }
}
