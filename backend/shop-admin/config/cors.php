<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Chỉ cho phép từ nguồn localhost:3000 (ứng dụng React)
    'allowed_origins' => ['http://localhost:5173','http://localhost:5174','http://127.0.0.1:8000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
