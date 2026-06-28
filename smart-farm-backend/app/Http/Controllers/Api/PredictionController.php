<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    /**
     * Display a listing of predictions.
     */
    public function index(Request $request)
    {
        $query = Prediction::with(['sensor.crop', 'admin']);

        if ($request->has('land_id')) {
            $query->whereHas('sensor', function ($q) use ($request) {
                $q->where('land_id', $request->land_id);
            });
        }

        $predictions = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Data prediksi berhasil diambil.',
            'data'    => $predictions,
        ]);
    }

    /**
     * Store a newly created prediction (disimpan manual oleh Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sensor_id'          => 'required|exists:sensors,id',
            'admin_id'           => 'required|exists:admins,id',
            'tanggal_pencatatan' => 'required|date',
            'status_kondisi'     => 'required|string|max:255',
            'rekomendasi'        => 'required|string',
        ]);

        $prediction = Prediction::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data prediksi berhasil disimpan.',
            'data'    => $prediction,
        ], 201);
    }

    /**
     * Display the specified prediction.
     */
    public function show(string $id)
    {
        $prediction = Prediction::with(['sensor.crop', 'admin'])->find($id);

        if (!$prediction) {
            return response()->json([
                'success' => false,
                'message' => 'Data prediksi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail prediksi berhasil diambil.',
            'data'    => $prediction,
        ]);
    }

    /**
     * Update prediction — DISABLED.
     * Prediksi tidak dapat diedit.
     */
    public function update(Request $request, string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Data prediksi tidak dapat diubah.',
        ], 403);
    }

    /**
     * Remove prediction — DISABLED.
     * Prediksi tidak dapat dihapus.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Data prediksi tidak dapat dihapus.',
        ], 403);
    }
}
