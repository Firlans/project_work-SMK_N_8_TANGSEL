<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use \App\Http\Controllers\SiswaController;
use \App\Http\Controllers\GuruController;
class RoleMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->header('Authorization');

            if (!$token) {
                return response()->json(['status' => 'error', 'message' => 'Token not provided'], 401);
            }

            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User not found'], 401);
            }

            // Cek role dan arahkan ke controller yang sesuai
            switch ($user->profile) {
                case 'guru':
                    return app(GuruController::class)->profile($request);
                case 'siswa':
                    return app(SiswaController::class)->profile($request);
                default:
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid profile'
                    ], 403);
            }
        } catch (TokenExpiredException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token has expired'
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token is invalid'
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 401);
        }
    }
}
