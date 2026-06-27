<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Land extends Model
{
    protected $fillable = [

        'user_id',

        'admin_id',

        'nama',

        'lokasi',

        'luas_lahan'
    ];
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function crops()
    {
        return $this->hasMany(Crop::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}
