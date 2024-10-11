<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Cho phép tất cả các endpoint trong API và Sanctum CSRF cookie
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Cho phép tất cả các phương thức HTTP như GET, POST, PUT, DELETE, PATCH
    'allowed_methods' => ['*'],

    // Chỉ cho phép từ nguồn localhost:3000 (ứng dụng React)
    'allowed_origins' => ['http://localhost:5173','http://localhost:5174','http://127.0.0.1:8000'],

    // Không sử dụng các mẫu regex cho domain
    'allowed_origins_patterns' => [],

    // Cho phép tất cả các header được gửi cùng request
    'allowed_headers' => ['*'],

    // Không cần phải expose thêm headers nào đặc biệt
    'exposed_headers' => [],

    // Thời gian mà trình duyệt có thể cache preflight request
    'max_age' => 0,

    // Nếu bạn không cần gửi cookie hoặc xác thực, để false
    // Nếu sử dụng Laravel Sanctum với SPA thì đặt thành true
    'supports_credentials' => true,

];
