<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IrrigationController;

Route::get('/', function () {
    return redirect()->route('irrigation.form');
});

Route::get('/irrigation', [IrrigationController::class, 'index'])
    ->name('irrigation.form');

Route::post('/irrigation/predict', [IrrigationController::class, 'predict'])
    ->name('irrigation.predict');