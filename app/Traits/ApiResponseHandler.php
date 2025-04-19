<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;

trait ApiResponseHandler
{
    protected function handleError(\Exception $e, $context)
    {
        Log::error("Error in {$context}:", [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        $response = [
            'status' => 'error',
            'message' => "An error occurred in {$context}"
        ];

        if (config('app.debug')) {
            $response['error'] = $e->getMessage();
        }

        return response()->json($response, 500);
    }
}
