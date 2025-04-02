<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class SiswaMiddleware
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
                return response()->json([
                    'status' => false,
                    'message' => 'User not found',
                    'data' => null
                ], 404);
            }

            if ($user->role !== 'siswa') {
                return response()->json([
                    'status' => false,
                    'message' => 'Access denied. Only students can access this resource',
                    'data' => null
                ], 403);
            }

            return $next($request);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Token has expired',
                'data' => null
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid token',
                'data' => null
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Token not found',
                'data' => null
            ], 401);
        }
    }
}
