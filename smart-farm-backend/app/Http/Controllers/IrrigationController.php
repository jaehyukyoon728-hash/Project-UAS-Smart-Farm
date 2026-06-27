<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class IrrigationController extends Controller
{
    // Opsi dropdown — harus cocok dengan konstanta di FastAPI
    private array $cropOptions = [
        'Carrot', 'Chilli', 'Potato', 'Tomato', 'Wheat'
    ];

    private array $soilOptions = [
        'Alluvial Soil', 'Black Soil', 'Chalky Soil',
        'Clay Soil', 'Loam Soil', 'Red Soil', 'Sandy Soil'
    ];

    private array $seedlingOptions = [
        'Germination',
        'Seedling Stage',
        'Vegetative Growth/Root or Tuber Development',
        'Flowering',
        'Pollination',
        'Fruit Formation',
        'Fruit Maturation',
        'Harvesting'
    ];

    public function index()
    {
        return view('irrigation.form', [
            'cropOptions'     => $this->cropOptions,
            'soilOptions'     => $this->soilOptions,
            'seedlingOptions' => $this->seedlingOptions,
        ]);
    }

    public function predict(Request $request)
    {
        $validated = $request->validate([
            'crop_id'        => 'required|string|in:' . implode(',', $this->cropOptions),
            'soil_type'      => 'required|string|in:' . implode(',', $this->soilOptions),
            'seedling_stage' => 'required|string|in:' . implode(',', $this->seedlingOptions),
            'moi'            => 'required|numeric|min:1|max:100',
            'temp'           => 'required|numeric|min:13|max:46',
            'humidity'       => 'required|numeric|min:15|max:91',
        ]);

        $response = Http::timeout(10)->post(
            config('services.fastapi.url') . '/predict',
            [
                'crop_id'        => $validated['crop_id'],
                'soil_type'      => $validated['soil_type'],
                'seedling_stage' => $validated['seedling_stage'],
                'moi'            => (float) $validated['moi'],
                'temp'           => (float) $validated['temp'],
                'humidity'       => (float) $validated['humidity'],
            ]
        );

        if ($response->failed()) {
            return back()
                ->withInput()
                ->withErrors(['prediction' => 'Layanan prediksi tidak tersedia. Pastikan FastAPI berjalan.']);
        }

        $result = $response->json();

        if (($result['status'] ?? '') !== 'success') {
            return back()
                ->withInput()
                ->withErrors(['prediction' => $result['message'] ?? 'Prediksi gagal.']);
        }

        return view('irrigation.result', [
            'input'  => $validated,
            'rf'     => $result['rf'],           // hasil Random Forest
            'kmeans' => $result['kmeans'],        // hasil K-Means
            'rec'    => $result['recommendation'] // rekomendasi gabungan
        ]);
    }
}