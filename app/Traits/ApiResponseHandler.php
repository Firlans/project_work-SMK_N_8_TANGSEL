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
    protected function handleReturnData($data, $statusCode)
    {
        if (env('APP_DEBUG') === 'true') {
            \Log::info("data = $data");
        }

        $isEmpty = false;
        if ($data instanceof \Illuminate\Support\Collection) {
            $isEmpty = $data->isEmpty();
        } elseif (is_null($data)) {
            $isEmpty = true;
        }

        return response()->json([
            "status" => "success",
            "message" => $isEmpty ? "No attendance records found" : "Successfully retrieved attendance records",
            "data" => $data
        ], $statusCode);
    }

    protected function handleUpdated($data, $object)
    {
        return response()->json([
            'status' => 'success',
            'message' => "$object created successfully",
            'data' => $data
        ], 201);
    }

    protected function handleDeleted($object)
    {
        return response()->json([
            'status' => 'success',
            'message' => "$object deleted successfully"
        ], 200);
    }
    protected function handlCreated($data, $object)
    {
        return response()->json([
            'status' => 'success',
            'message' => "$object created successfully",
            'data' => $data
        ], 201);
    }


    protected function handleNotFoundData($message)
    {
        return response()->json(
            [
                'status' => 'error',
                'message' => $message,
            ],
            404
        );
    }

    protected function invalidParameter($parameter)
    {
        return response()->json(
            [
                'status' => 'error',
                'message' => "invalid parameter $parameter",
            ],
            400
        );
    }
}
