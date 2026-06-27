<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [

        'admin_id',

        'user_id',

        'land_id',

        'prediction_id',

        'activity_type',

        'description'

    ];
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    public function prediction()
    {
        return $this->belongsTo(Prediction::class);
    }
}
