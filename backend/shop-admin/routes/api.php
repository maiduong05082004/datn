<?php

use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\Product\ProductController;
use App\Http\Controllers\Api\Client\AuthController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\Cart\CartController;
use App\Http\Controllers\Api\Client\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\Product\AttributeController;
use App\Http\Controllers\Api\Admin\Product\AttributeGroupController;
use App\Http\Controllers\Api\Admin\Product\AttributeValueController;
use App\Http\Controllers\Api\Admin\WishlistController;
use App\Http\Controllers\Api\Client\HomeController;
use App\Http\Controllers\Api\Client\Product\ProductController as ProductProductController;

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

Route::prefix('client')->as('client.')->group(function () {
    Route::prefix('auth')
        ->as('auth.')
        ->group(function () {
            Route::post('/signup', [AuthController::class, 'register'])->name('signup');
            Route::post('/signin', [AuthController::class, 'login'])->name('signin');
            Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
            Route::get('/profile', [AuthController::class, 'user'])->middleware('auth:sanctum')->name('profile');
            Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest')->name('password.email');
            Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('guest')->name('password.update');
            Route::get('/reset-password/{token}', function ($token) {
                return response()->json(['token' => $token]);
            })->middleware('guest')->name('password.reset');
            Route::get('/google', [AuthController::class, 'redirectToGoogle'])->name('google.redirect');
            Route::get('/callback/google', [AuthController::class, 'handleGoogleCallback'])->name('google.callback');
        });
    Route::prefix('categories')->as('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('list');
        Route::get('/{id}', [CategoryController::class, 'showCategoryProducts'])->name('products.show');
    });


    Route::prefix('home')->as('home.')->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('index');
        Route::get('search', [HomeController::class, 'search'])->name('search');
    });


    Route::prefix('products')->as('products.')->group(function () {
        Route::get('/showDetail/{id}', [ProductProductController::class, 'showDetail'])->name('showDetail');
    });
});
Route::prefix('admins')
    ->as('admins.')
    ->group(function () {
        Route::post('/signin', [AdminAuthController::class, 'login'])->name('signin');
        Route::middleware(['auth:admin', 'admin'])->group(function () {
            Route::apiResource('products', ProductController::class)
                ->names('products');
            Route::apiResource('attributes', AttributeController::class)
                ->names('attributes');
            Route::apiResource('attribute_groups', AttributeGroupController::class)
                ->names('attribute_groups');
            Route::apiResource('attribute_values', AttributeValueController::class)
                ->names('attribute_values');
            Route::prefix('categories')->group(function () {
                Route::post('{id}/soft-delete', [AdminCategoryController::class, 'softDestroy'])->name('categories.soft-delete');
                Route::post('{id}/restore', [AdminCategoryController::class, 'restore'])->name('categories.restore');
                Route::get('trash', [AdminCategoryController::class, 'trash']);
            });
            Route::apiResource('categories', AdminCategoryController::class);
            Route::prefix('users')->group(function () {
                Route::post('/wishlist/add/', [WishlistController::class, 'addToWishlist'])->name('wishlist.add');
                Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
                Route::get('/', [UserController::class, 'index']);
                Route::post('/store', [UserController::class, 'store']);
                Route::get('/{id}', [UserController::class, 'show']);
                Route::put('/{id}', [UserController::class, 'update']);

                Route::apiResource('users', UserController::class);

                Route::get('/{id}/block', [UserController::class, 'blockUser']);

                Route::put('/{id}/unblock', [UserController::class, 'unblockUser']);
                Route::delete('/wishlist/remove/{id}', [WishlistController::class, 'destroy'])->name('wishlist.remove');
            });
        });
    });
