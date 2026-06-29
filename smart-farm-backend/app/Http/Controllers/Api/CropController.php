<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use Illuminate\Http\Request;

class CropController extends Controller
{
    /**
     * Display a listing of crops.
     */
    public function index(Request $request)
    {
        $query = Crop::with(['land', 'sensors']);

        if ($request->has('land_id')) {
            $query->where('land_id', $request->land_id);
        }

        $crops = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Data tanaman berhasil diambil.',
            'data'    => $crops,
        ]);
    }

    /**
     * Store a newly created crop (milik Lahan).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'land_id'    => 'required|exists:lands,id',
            'nama'       => 'required|in:Gandum,Cabai,Wortel,Kentang,Tomat',
            'jenis_tanah' => 'required|in:Tanah Liat,Tanah Pasir,Tanah Merah,Tanah Lempung,Tanah Hitam,Tanah Aluvial,Tanah Pesisir',
        ]);

        $crop = Crop::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tanaman berhasil ditambahkan.',
            'data'    => $crop,
        ], 201);
    }

    /**
     * Display the specified crop.
     */
    public function show(string $id)
    {
        $crop = Crop::with(['land', 'sensors'])->find($id);

        if (!$crop) {
            return response()->json([
                'success' => false,
                'message' => 'Tanaman tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail tanaman berhasil diambil.',
            'data'    => $crop,
        ]);
    }

    /**
     * Update the specified crop.
     */
    public function update(Request $request, string $id)
    {
        $crop = Crop::find($id);

        if (!$crop) {
            return response()->json([
                'success' => false,
                'message' => 'Tanaman tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'land_id'    => 'sometimes|exists:lands,id',
            'nama'       => 'sometimes|in:Gandum,Cabai,Wortel,Kentang,Tomat',
            'jenis_tanah' => 'sometimes|in:Tanah Liat,Tanah Pasir,Tanah Merah,Tanah Lempung,Tanah Hitam,Tanah Aluvial,Tanah Pesisir',
        ]);

        $crop->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data tanaman berhasil diperbarui.',
            'data'    => $crop,
        ]);
    }

    /**
     * Remove crop — DISABLED.
     * Tanaman tidak dapat dihapus.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Tanaman tidak dapat dihapus.',
        ], 403);
    }
}
