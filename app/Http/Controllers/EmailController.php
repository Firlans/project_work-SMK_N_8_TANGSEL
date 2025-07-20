<?php

namespace App\Http\Controllers;

use App\Mail\CustomEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
class EmailController extends Controller
{
    public function sendEmail($to, Request $request)
    {
        // Logic to send email
        // 1. Validasi input dari request body
        $validator = Validator::make($request->all(), [
            'subject' => 'nullable|string|max:255',
            'template' => 'required|string',
        ]);

        \Log::info('Menerima permintaan untuk mengirim email ke: ' . json_encode($request->all()));

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }


        $validatedData = $validator->validated();

        $mailData = [
            'subject' => $validatedData['subject'] ?? 'Pesan dari Aplikasi Anda',
            'htmlContent' => $validatedData['template'],
        ];

        try {
            Mail::to($to)->send(new CustomEmail($mailData));

            return response()->json([
                'status' => 'success',
                'message' => 'Email berhasil dikirim ke ' . $to . '!',
                'recipient' => $to
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Gagal mengirim email ke ' . $to . ': ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim email.',
                'error_details' => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }
}
