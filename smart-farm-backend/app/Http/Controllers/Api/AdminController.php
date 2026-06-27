<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of admins.
     */
    public function index()
    {
        $admins = Admin::with(['users', 'lands', 'predictions'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data admin berhasil diambil.',
            'data'    => $admins,
        ]);
    }

    /**
     * Store a newly created admin — DISABLED.
     * Admin tidak dapat menambah admin lain.
     */
    public function store(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Admin tidak dapat menambah admin lain.',
        ], 403);
    }

    /**
     * Display the specified admin.
     */
    public function show(string $id)
    {
        $admin = Admin::with(['users', 'lands', 'predictions'])->find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail admin berhasil diambil.',
            'data'    => $admin,
        ]);
    }

    /**
     * Update the specified admin.
     */
    public function update(Request $request, string $id)
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'nama'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:admins,email,' . $id,
            'no_phone' => 'sometimes|string|max:20',
        ]);

        $admin->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data admin berhasil diperbarui.',
            'data'    => $admin,
        ]);
    }

    /**
     * Remove admin — DISABLED.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Admin tidak dapat dihapus.',
        ], 403);
    }
}
