<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LandController;
use App\Http\Controllers\Api\CropController;
use App\Http\Controllers\Api\SensorController;
use App\Http\Controllers\Api\PredictionController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\PredictionProxyController;

// ── Auth (publik, tidak perlu token) ──────────────────────────────
Route::post('/login',  [AuthController::class, 'login']);

// ── Route yang dilindungi Sanctum ─────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Prediksi via FastAPI proxy (simpan sensor + prediction ke DB)
    Route::post('/predict-irrigation', [PredictionProxyController::class, 'predict']);

    // Admin: hanya bisa melihat dan mengedit data admin (tidak bisa tambah/hapus admin)
    Route::apiResource('admins', AdminController::class)->only(['index', 'show', 'update']);

    // User: CRUD lengkap, dikelola oleh Admin
    Route::apiResource('users', UserController::class);

    // Land: tidak bisa dihapus
    Route::apiResource('lands', LandController::class)->except(['destroy']);

    // Crop: tidak bisa dihapus
    Route::apiResource('crops', CropController::class)->except(['destroy']);

    // Sensor: tidak bisa dihapus
    Route::apiResource('sensors', SensorController::class)->except(['destroy']);

    // Prediction: hanya bisa lihat dan simpan, tidak bisa edit/hapus
    Route::apiResource('predictions', PredictionController::class)->only(['index', 'show', 'store']);

    // Activity: hanya bisa lihat dan catat, tidak bisa edit/hapus (log permanen)
    Route::apiResource('activities', ActivityController::class)->only(['index', 'show', 'store']);

});