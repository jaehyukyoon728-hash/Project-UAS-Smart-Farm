<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = [

        'land_id',

        'nama',

        'jenis_tanah'

    ];
    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    public function sensors()
    {
        return $this->hasMany(Sensor::class);
    }
}
