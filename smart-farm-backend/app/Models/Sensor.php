<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $fillable = [

        'land_id',

        'crop_id',

        'tahap_pertumbuhan',

        'moi',

        'tempt',

        'kelembaban_udara'

    ];
    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function prediction()
    {
        return $this->hasOne(Prediction::class);
    }
}
