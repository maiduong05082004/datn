<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Chỉ cho phép từ nguồn localhost:3000 (ứng dụng React)
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Nếu bạn không cần gửi cookie hoặc xác thực, để false
    // Nếu sử dụng Laravel Sanctum với SPA thì đặt thành true
    'supports_credentials' => true,

];
