<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:8000',
        'https://your-production-frontend.com',
        'https://*.ngrok-free.app'
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
