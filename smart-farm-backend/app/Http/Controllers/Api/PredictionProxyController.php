<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use App\Models\Prediction;
use App\Models\Sensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PredictionProxyController extends Controller
{
    /**
     * Menerima data sensor dari React, meneruskan ke FastAPI,
     * menyimpan sensor + prediction ke database, dan mengembalikan hasil.
     *
     * Input (JSON):
     *   land_id, crop_id, seedling_stage, moi, temp, humidity
     *
     * FastAPI input: crop_id (nama), soil_type, seedling_stage (EN), moi, temp, humidity
     */
    public function predict(Request $request)
    {
        $validated = $request->validate([
            'land_id'           => 'required|exists:lands,id',
            'crop_id'           => 'required|exists:crops,id',
            'seedling_stage'    => 'required|string',
            'moi'               => 'required|numeric|min:1|max:100',
            'temp'              => 'required|numeric|min:13|max:46',
            'humidity'          => 'required|numeric|min:15|max:91',
            'admin_id'          => 'required|exists:admins,id',
        ]);

        // Ambil data crop untuk dapatkan nama dan jenis_tanah
        $crop = Crop::findOrFail($validated['crop_id']);

        // Peta nama tanaman Indonesia → FastAPI (Bahasa Inggris)
        $cropMap = [
            'Cabai'   => 'Chilli',
            'Tomat'   => 'Tomato',
            'Wortel'  => 'Carrot',
            'Kentang' => 'Potato',
            'Gandum'  => 'Wheat',
        ];

        // Peta jenis tanah Indonesia → FastAPI (Bahasa Inggris)
        $soilMap = [
            'Tanah Liat'    => 'Clay Soil',
            'Tanah Lempung' => 'Loam Soil',
            'Tanah Pasir'   => 'Sandy Soil',
            'Tanah Merah'   => 'Red Soil',
            'Tanah Hitam'   => 'Black Soil',
            'Tanah Aluvial' => 'Alluvial Soil',
            'Tanah Pesisir' => 'Chalky Soil',
        ];

        // Peta fase pertumbuhan Indonesia → FastAPI (Bahasa Inggris)
        $stageMap = [
            'Perkecambahan'    => 'Germination',
            'Tahap Bibit'      => 'Seedling Stage',
            'Umbi'             => 'Vegetative Growth/Root or Tuber Development',
            'Vegetatif'        => 'Vegetative Growth/Root or Tuber Development',
            'Generatif'        => 'Flowering',
            'Pembungaan'       => 'Flowering',
            'Penyerbukan'      => 'Pollination',
            'Pembentukan Buah' => 'Fruit Formation',
            'Pematangan Buah'  => 'Fruit Maturation',
            'Pemanenan'        => 'Harvesting',
        ];

        $cropNameEn  = $cropMap[$crop->nama]         ?? $crop->nama;
        $soilTypeEn  = $soilMap[$crop->jenis_tanah]  ?? $crop->jenis_tanah;
        $stageEn     = $stageMap[$validated['seedling_stage']] ?? $validated['seedling_stage'];

        // ── Kirim ke FastAPI ───────────────────────────────────────────
        $fastapiUrl = config('services.fastapi.url') . '/predict';

        $response = Http::timeout(15)->post($fastapiUrl, [
            'crop_id'        => $cropNameEn,
            'soil_type'      => $soilTypeEn,
            'seedling_stage' => $stageEn,
            'moi'            => (float) $validated['moi'],
            'temp'           => (float) $validated['temp'],
            'humidity'       => (float) $validated['humidity'],
        ]);

        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Layanan prediksi tidak tersedia. Pastikan FastAPI sedang berjalan.',
            ], 503);
        }

        $result = $response->json();

        if (($result['status'] ?? '') !== 'success') {
            return response()->json([
                'success' => false,
                'message' => $result['message'] ?? 'Prediksi gagal.',
            ], 422);
        }

        // ── Simpan data Sensor ────────────────────────────────────────
        $sensor = Sensor::create([
            'land_id'           => $validated['land_id'],
            'crop_id'           => $validated['crop_id'],
            'tahap_pertumbuhan' => $validated['seedling_stage'],
            'moi'               => $validated['moi'],
            'tempt'             => $validated['temp'],
            'kelembaban_udara'  => $validated['humidity'],
        ]);

        // ── Simpan data Prediction ────────────────────────────────────
        $rfLabel        = $result['rf']['prediction_label']  ?? 'Tidak Diketahui';
        $rekomendasi    = $result['recommendation']['detail'] ?? $result['recommendation']['summary'] ?? '-';

        $prediction = Prediction::create([
            'sensor_id'          => $sensor->id,
            'admin_id'           => $validated['admin_id'],
            'tanggal_pencatatan' => now()->toDateString(),
            'status_kondisi'     => $rfLabel,
            'rekomendasi'        => $rekomendasi,
            'rf'                 => $result['rf'] ?? null,
            'kmeans'             => $result['kmeans'] ?? null,
        ]);

        // ── Kembalikan hasil ke React ─────────────────────────────────
        return response()->json([
            'success'    => true,
            'message'    => 'Prediksi berhasil.',
            'sensor'     => $sensor,
            'prediction' => $prediction,
            'rf'         => $result['rf'],
            'kmeans'     => $result['kmeans'],
            'recommendation' => $result['recommendation'],
        ], 201);
    }
}
