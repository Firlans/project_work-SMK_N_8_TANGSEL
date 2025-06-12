<?php

namespace App\Http\Middleware;
use Exception;
use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            \Log::info('masuk'.json_encode($request->all()));
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Token is Invalid',
                ]);
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Token is Expired'
                ]);
            } else {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Authorization Token not found'
                ]);
            }
        }
        return $next($request);
    }
}