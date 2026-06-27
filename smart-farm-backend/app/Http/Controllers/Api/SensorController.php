<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    /**
     * Display a listing of sensor data.
     */
    public function index()
    {
        $sensors = Sensor::with(['crop', 'prediction'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data sensor berhasil diambil.',
            'data'    => $sensors,
        ]);
    }

    /**
     * Store a newly created sensor data (ditambahkan oleh User).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'land_id'           => 'required|exists:lands,id',
            'crop_id'           => 'required|exists:crops,id',
            'tahap_pertumbuhan' => 'required|string|max:255',
            'moi'               => 'required|numeric|min:0|max:100',
            'tempt'             => 'required|numeric',
            'kelembaban_udara'  => 'required|numeric|min:0|max:100',
        ]);

        $sensor = Sensor::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data sensor berhasil ditambahkan.',
            'data'    => $sensor,
        ], 201);
    }

    /**
     * Display the specified sensor data.
     */
    public function show(string $id)
    {
        $sensor = Sensor::with(['crop', 'prediction'])->find($id);

        if (!$sensor) {
            return response()->json([
                'success' => false,
                'message' => 'Data sensor tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail data sensor berhasil diambil.',
            'data'    => $sensor,
        ]);
    }

    /**
     * Update the specified sensor data.
     */
    public function update(Request $request, string $id)
    {
        $sensor = Sensor::find($id);

        if (!$sensor) {
            return response()->json([
                'success' => false,
                'message' => 'Data sensor tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'land_id'           => 'sometimes|exists:lands,id',
            'crop_id'           => 'sometimes|exists:crops,id',
            'tahap_pertumbuhan' => 'sometimes|string|max:255',
            'moi'               => 'sometimes|numeric|min:0|max:100',
            'tempt'             => 'sometimes|numeric',
            'kelembaban_udara'  => 'sometimes|numeric|min:0|max:100',
        ]);

        $sensor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data sensor berhasil diperbarui.',
            'data'    => $sensor,
        ]);
    }

    /**
     * Remove sensor data — DISABLED.
     * Data sensor tidak dapat dihapus.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Data sensor tidak dapat dihapus.',
        ], 403);
    }
}
