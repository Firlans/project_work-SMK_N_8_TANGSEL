<?php

return [

    'paths' => ['*'],

    'allowed_methods' => [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:8000',
        // 'https://*.ngrok-free.app',
        // 'https://x61n12fl-5173.asse.devtunnels.ms'
        // '*'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Authorization',
        'Accept',
        'X-XSRF-TOKEN'
    ],

    'exposed_headers' => [
        'Cache-Control',
        'Content-Language',
        'Content-Type',
        'Expires',
        'Last-Modified',
        'Pragma'
    ],

    'max_age' => 60 * 60 * 24, // 24 hours in seconds

    'supports_credentials' => true,

];
