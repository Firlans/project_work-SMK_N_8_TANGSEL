<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Cek role dan arahkan ke controller yang sesuai
            switch ($user->role) {
                case 'admin':
                case 'konselor':
                case 'guru':
                    return app(\App\Http\Controllers\GuruController::class)->profile($request);
                case 'siswa':
                    return app(\App\Http\Controllers\SiswaController::class)->profile($request);
                default:
                    return response()->json(['error' => 'Invalid role'], 403);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalid or expired'], 401);
        }
    }
}
