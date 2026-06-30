<?php

// Load Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Prediction;
use App\Models\Activity;

echo "Populating activities for existing predictions...\n";

$predictions = Prediction::with(['sensor.crop.land'])->get();

foreach ($predictions as $p) {
    // Check if activity already exists for this prediction
    $exists = Activity::where('prediction_id', $p->id)->exists();
    if (!$exists) {
        $sensor = $p->sensor;
        if (!$sensor || !$sensor->crop || !$sensor->crop->land) {
            echo "Skipping prediction ID {$p->id} due to missing relationship.\n";
            continue;
        }
        
        $crop = $sensor->crop;
        $land = $crop->land;
        
        Activity::create([
            'admin_id'      => $p->admin_id,
            'user_id'       => $land->user_id,
            'land_id'       => $land->id,
            'prediction_id' => $p->id,
            'activity_type' => 'Prediksi Irigasi',
            'description'   => "Melakukan prediksi irigasi untuk tanaman {$crop->nama} di {$land->nama}. Hasil: {$p->status_kondisi}.",
            'created_at'    => $p->created_at,
            'updated_at'    => $p->updated_at,
        ]);
        echo "Created activity for prediction ID {$p->id}\n";
    } else {
        echo "Activity already exists for prediction ID {$p->id}\n";
    }
}

echo "Done!\n";
