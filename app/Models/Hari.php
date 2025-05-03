<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hari extends Model
{
    protected $fillable = ['nama_hari'];
    protected $table = 'hari';

    public function jadwal(){
        return $this->hasMany(Jadwal::class, 'id_hari', 'id');
    }
}
