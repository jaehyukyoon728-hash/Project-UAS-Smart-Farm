<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::with(['admin', 'lands.crops.sensors.prediction'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diambil.',
            'data'    => $users,
        ]);
    }

    /**
     * Store a newly created user (dikelola oleh Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,id',
            'nama'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'nim'      => 'required|string|unique:users,nim',
            'no_phone' => 'required|string|max:20',
            'lokasi'   => 'nullable|string|max:255',
            'password' => 'required|string|min:8',
            'status'   => 'sometimes|in:aktif,tidak aktif',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['status']   = $validated['status'] ?? 'aktif';

        $user = User::create($validated);

        // ── Simpan data Activity ──────────────────────────────────────
        \App\Models\Activity::create([
            'admin_id'      => $validated['admin_id'],
            'user_id'       => $user->id,
            'activity_type' => 'Registrasi Petani',
            'description'   => "Mendaftarkan petani baru bernama {$user->nama} ({$user->email}).",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan.',
            'data'    => $user,
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(string $id)
    {
        $user = User::with(['admin', 'lands.crops.sensors.prediction'])->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail user berhasil diambil.',
            'data'    => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'admin_id' => 'sometimes|exists:admins,id',
            'nama'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'nim'      => 'sometimes|string|unique:users,nim,' . $id,
            'no_phone' => 'sometimes|string|max:20',
            'lokasi'   => 'sometimes|nullable|string|max:255',
            'password' => 'sometimes|string|min:8',
            'status'   => 'sometimes|in:aktif,tidak aktif',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diperbarui.',
            'data'    => $user,
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus.',
        ]);
    }
}
