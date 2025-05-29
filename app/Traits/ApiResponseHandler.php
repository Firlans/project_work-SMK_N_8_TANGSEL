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
    protected function handleReturnData($data, $objectName)
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
            "message" => $isEmpty ? "No $objectName records found" : "Successfully retrieved $objectName records",
            "data" => $data ?? (object) []
        ], 200);
    }

    protected function handleUpdated($data, $objectName)
    {
        return response()->json([
            'status' => 'success',
            'message' => "$objectName updated successfully",
            'data' => $data
        ], 200);
    }

    protected function handleDeleted($objectName, $data)
    {
        return response()->json([
            'status' => 'success',
            'message' => "$objectName deleted successfully",
            'id' => $data
        ], 200);
    }
    protected function handleCreated($data, $objectName)
    {
        return response()->json([
            'status' => 'success',
            'message' => "$objectName created successfully",
            'data' => $data
        ], 201);
    }


    protected function handleNotFoundData($data, $objectName, $objectSearch = null)
    {
        return response()->json(
            [
                'status' => 'error',
                'message' => "$objectName with " . ($objectSearch ?? 'ID') ." $data not found",
            ],
            404
        );
    }

    protected function invalidParameter($parameter)
    {
        return response()->json(
            [
                'status' => 'fail',
                'message' => "invalid parameter $parameter",
            ],
            400
        );
    }

    protected function handleFail($task, $object){
        return response()->json([
            'status'=> 'fail',
            'message' => "failed to $task $object"
        ]);
    }
}
