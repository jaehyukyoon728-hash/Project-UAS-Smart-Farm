<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Model
{
    use HasApiTokens;
    protected $fillable = [

        'nama',

        'email',

        'no_phone'

    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function lands()
    {
        return $this->hasMany(Land::class);
    }

    public function predictions()
    {
        return $this->hasMany(Prediction::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}


