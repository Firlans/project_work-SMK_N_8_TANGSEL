<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FonnteService
{
    protected $url = 'https://api.fonnte.com/send';
    protected $token;

    public function __construct()
    {
        $this->token = env('FONNTE_TOKEN', 'jgg8s6AECTBtrNgV5vVc');
    }

    /**
     * Kirim pesan WA ke nomor tujuan
     */
    public function sendMessage(string $to, string $message): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->asForm()
                ->post($this->url, [
                    'target' => $to,
                    'message' => $message,
                ]);

            \Log::info('Fonnte token: ' . $this->token);
            \Log::info('Fonnte response: ' . $response->body());

            return $response->json();

        } catch (\Exception $e) {
            \Log::error('Fonnte API Error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
