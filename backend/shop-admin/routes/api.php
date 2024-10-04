<?php

use App\Http\Controllers\Api\Admin\Product\ProductController;
use App\Http\Controllers\Api\Client\AuthController;
use App\Http\Controllers\Api\Client\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::post('/signup', [AuthController::class, 'register']);
Route::post('/signin', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/callback/google', [AuthController::class, 'handleGoogleCallback']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/category/{id}/products', [CategoryController::class, 'showCategoryProducts']);


// Route::middleware(['auth']) // thêm check admin nhé
//     ->prefix('admins')
//     ->as('admins.')
//     ->group(function () {
   
//         Route::resource('products', ProductController::class)
//             ->names('products');

//     });


Route::prefix('admins')
    ->as('admins.')
    ->group(function () {
   
        Route::resource('products', ProductController::class)
            ->names('products');

    });
