<?php

// Load Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Land;
use App\Models\Crop;
use App\Models\Sensor;
use App\Models\Prediction;
use App\Models\Activity;

echo "=== USERS ===\n";
foreach (User::all() as $u) {
    echo "ID: {$u->id}, Nama: {$u->nama}, Email: {$u->email}, Status: {$u->status}\n";
}

echo "\n=== LANDS ===\n";
foreach (Land::all() as $l) {
    echo "ID: {$l->id}, UserID: {$l->user_id}, Nama: {$l->nama}\n";
}

echo "\n=== CROPS ===\n";
foreach (Crop::all() as $c) {
    echo "ID: {$c->id}, LandID: {$c->land_id}, Nama: {$c->nama}\n";
}

echo "\n=== SENSORS ===\n";
foreach (Sensor::all() as $s) {
    echo "ID: {$s->id}, CropID: {$s->crop_id}, Tahap: {$s->tahap_pertumbuhan}, Moi: {$s->moi}\n";
}

echo "\n=== PREDICTIONS ===\n";
foreach (Prediction::all() as $p) {
    echo "ID: {$p->id}, SensorID: {$p->sensor_id}, Status: {$p->status_kondisi}, Tgl: {$p->tanggal_pencatatan}\n";
}

echo "\n=== ACTIVITIES ===\n";
foreach (Activity::all() as $a) {
    echo "ID: {$a->id}, Type: {$a->activity_type}, Desc: {$a->description}, Created: {$a->created_at}\n";
}
