<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Land;
use Illuminate\Http\Request;

class LandController extends Controller
{
    /**
     * Display a listing of lands.
     */
    public function index()
    {
        $lands = Land::with(['user', 'admin', 'crops.sensors'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data lahan berhasil diambil.',
            'data'    => $lands,
        ]);
    }

    /**
     * Store a newly created land (oleh User, dimonitor Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'    => 'required|exists:users,id',
            'admin_id'   => 'required|exists:admins,id',
            'nama'       => 'required|string|max:255',
            'lokasi'     => 'required|string|max:255',
            'luas_lahan' => 'required|numeric|min:0',
        ]);

        $land = Land::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lahan berhasil ditambahkan.',
            'data'    => $land,
        ], 201);
    }

    /**
     * Display the specified land.
     */
    public function show(string $id)
    {
        $land = Land::with(['user', 'admin', 'crops.sensors'])->find($id);

        if (!$land) {
            return response()->json([
                'success' => false,
                'message' => 'Lahan tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail lahan berhasil diambil.',
            'data'    => $land,
        ]);
    }

    /**
     * Update the specified land.
     */
    public function update(Request $request, string $id)
    {
        $land = Land::find($id);

        if (!$land) {
            return response()->json([
                'success' => false,
                'message' => 'Lahan tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'user_id'    => 'sometimes|exists:users,id',
            'admin_id'   => 'sometimes|exists:admins,id',
            'nama'       => 'sometimes|string|max:255',
            'lokasi'     => 'sometimes|string|max:255',
            'luas_lahan' => 'sometimes|numeric|min:0',
        ]);

        $land->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data lahan berhasil diperbarui.',
            'data'    => $land,
        ]);
    }

    /**
     * Remove land — DISABLED.
     * Lahan tidak dapat dihapus.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Lahan tidak dapat dihapus.',
        ], 403);
    }
}
