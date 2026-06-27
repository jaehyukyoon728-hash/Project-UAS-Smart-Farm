<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Display a listing of activities.
     */
    public function index()
    {
        $activities = Activity::with(['admin', 'user', 'land', 'prediction'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data aktivitas berhasil diambil.',
            'data'    => $activities,
        ]);
    }

    /**
     * Store a newly created activity (log permanen).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'admin_id'      => 'nullable|exists:admins,id',
            'user_id'       => 'nullable|exists:users,id',
            'land_id'       => 'nullable|exists:lands,id',
            'prediction_id' => 'nullable|exists:predictions,id',
            'activity_type' => 'required|string|max:255',
            'description'   => 'required|string',
        ]);

        $activity = Activity::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Aktivitas berhasil dicatat.',
            'data'    => $activity,
        ], 201);
    }

    /**
     * Display the specified activity.
     */
    public function show(string $id)
    {
        $activity = Activity::with(['admin', 'user', 'land', 'prediction'])->find($id);

        if (!$activity) {
            return response()->json([
                'success' => false,
                'message' => 'Data aktivitas tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail aktivitas berhasil diambil.',
            'data'    => $activity,
        ]);
    }

    /**
     * Update activity — DISABLED.
     * Aktivitas adalah log permanen dan tidak dapat diubah.
     */
    public function update(Request $request, string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Log aktivitas tidak dapat diubah.',
        ], 403);
    }

    /**
     * Remove activity — DISABLED.
     * Aktivitas adalah log permanen dan tidak dapat dihapus.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Log aktivitas tidak dapat dihapus.',
        ], 403);
    }
}
