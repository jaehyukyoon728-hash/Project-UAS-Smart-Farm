<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login — cek tabel admins dulu, lalu users.
     * Response: { success, role, token, user }
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // ── Cek Admin ─────────────────────────────────────────────
        $admin = Admin::where('email', $request->email)->first();

        if ($admin && Hash::check($request->password, $admin->password)) {
            $token = $admin->createToken('admin-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'role'    => 'admin',
                'token'   => $token,
                'user'    => [
                    'id'       => $admin->id,
                    'nama'     => $admin->nama,
                    'email'    => $admin->email,
                    'no_phone' => $admin->no_phone,
                    'role'     => 'admin',
                ],
            ]);
        }

        // ── Cek User / Petani ──────────────────────────────────────
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password tidak valid.',
            ], 401);
        }

        if ($user->status === 'tidak aktif') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda tidak aktif. Hubungi admin.',
            ], 403);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'role'    => 'farmer',
            'token'   => $token,
            'user'    => [
                'id'       => $user->id,
                'nama'     => $user->nama,
                'email'    => $user->email,
                'nim'      => $user->nim,
                'no_phone' => $user->no_phone,
                'lokasi'   => $user->lokasi,
                'status'   => $user->status,
                'admin_id' => $user->admin_id,
                'role'     => 'farmer',
            ],
        ]);
    }

    /**
     * Logout — hapus semua token milik user/admin yang sedang login.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar.',
        ]);
    }

    /**
     * Mengembalikan data user/admin yang sedang login.
     */
    public function me(Request $request)
    {
        $tokenable = $request->user();

        return response()->json([
            'success' => true,
            'data'    => $tokenable,
        ]);
    }
}
