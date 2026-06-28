<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    protected $fillable = [

        'sensor_id',

        'admin_id',

        'tanggal_pencatatan',

        'status_kondisi',

        'rekomendasi',

        'rf',

        'kmeans'

    ];

    protected $casts = [
        'rf' => 'array',
        'kmeans' => 'array',
    ];
    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}
