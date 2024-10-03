<?php

use App\Http\Controllers\Api\Client\AuthController;
use App\Http\Controllers\Api\Client\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController; 
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('user')->group(function () {
    Route::post('/signup', [AuthController::class, 'register']);
    Route::post('/signin', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest')->name('password.email');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('guest')->name('password.update');
    Route::get('/reset-password/{token}', function ($token) {
        return response()->json(['token' => $token]);
    })->middleware('guest')->name('password.reset');
});

Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/callback/google', [AuthController::class, 'handleGoogleCallback']);

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{id}/products', [CategoryController::class, 'showCategoryProducts']);
});

Route::prefix('admin/categories')->group(function () {
    Route::get('/', [AdminCategoryController::class, 'index']);
    Route::post('/', [AdminCategoryController::class, 'store']);
    Route::get('/{id}', [AdminCategoryController::class, 'show']);
    Route::put('/{id}', [AdminCategoryController::class, 'update']);
    Route::delete('/{id}', [AdminCategoryController::class, 'destroy']);
});
