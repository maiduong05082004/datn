<?php

use App\Http\Controllers\Api\Admin\Product\ProductController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Client\AuthController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Client\CategoryController;
use App\Http\Controllers\Api\Client\Product\ProductController as ClientProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\Product\AttributeController;
use App\Http\Controllers\Api\Admin\Product\AttributeGroupController;
use App\Http\Controllers\Api\Admin\Product\AttributeValueController;
use App\Http\Controllers\Api\Admin\PromotionsController;
use App\Http\Controllers\Api\Client\HomeController;
use App\Http\Controllers\Api\Client\Product\ProductController as ProductProductController;
use App\Http\Controllers\Api\Admin\WishlistController;
use App\Http\Controllers\Api\Client\Product\ShippingController;
use App\Http\Controllers\Api\Client\PromotionController;

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
        Route::get('/colors', [CategoryController::class, 'getAllColors']);
        Route::post('/{id}', [CategoryController::class, 'getFilterOptionsByCategory']);
        Route::get('/{id}/sizes', [CategoryController::class, 'getCategoryAttributes']);
        Route::get('/{id}/children', [CategoryController::class, 'getCategoryChildren']);
    });
    Route::prefix('promotions')->middleware('auth:sanctum')->group(function () {
        Route::post('/', [PromotionController::class, 'applyPromotion']);
        Route::get('/available-promotions', [PromotionController::class, 'getAvailablePromotions']);
        Route::get('/history', [PromotionController::class, 'getPromotionHistory']);
        Route::post('/check', [PromotionController::class, 'checkPromotion']);
        Route::get('/product/{productId}', [PromotionController::class, 'getProductPromotions']);

    });
    Route::prefix('home')->as('home.')->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('index');
        Route::get('search', [HomeController::class, 'search'])->name('search');
    });
    Route::apiResource('shippingaddress', ShippingController::class)
        ->names('shippingaddress');
    Route::prefix('products')->as('products.')->group(function () {
        Route::get('/showDetail/{id}',[ProductProductController::class, 'showDetail'])->name('showDetail');
        Route::post('/purchase',[ProductProductController::class, 'purchase'])->name('purchase');
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
                Route::get('/', [UserController::class, 'index']);
                Route::post('/', [UserController::class, 'store']);
                Route::get('/{id}', [UserController::class, 'show']);
                Route::put('/{id}', [UserController::class, 'update']);
                Route::apiResource('users', UserController::class);
                Route::get('/{id}/block', [UserController::class, 'blockUser']);
                Route::put('/{id}/unblock', [UserController::class, 'unblockUser']);
                Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
                Route::post('/wishlist/add/{id}', [WishlistController::class, 'addToWishlist'])->name('wishlist.add');
                Route::delete('/wishlist/remove/{id}', [WishlistController::class, 'removeFromWishlist'])->name('wishlist.remove');
            });
            Route::prefix('promotions')->group(function () {
                Route::get('/new-users', [PromotionsController::class, 'getNewUserPromotions'])->name('promotions.new-users');
                Route::get('/', [PromotionsController::class, 'index'])->name('promotions.index'); // List tất cả khuyến mãi
                Route::post('/', [PromotionsController::class, 'store'])->name('promotions.store'); // Tạo khuyến mãi mới
                Route::get('/{id}', [PromotionsController::class, 'show'])->name('promotions.show'); // Xem chi tiết khuyến mãi
                Route::put('/{id}', [PromotionsController::class, 'update'])->name('promotions.update'); // Cập nhật khuyến mãi
                Route::delete('/{id}', [PromotionsController::class, 'destroy'])->name('promotions.destroy'); // Xóa khuyến mãi
                Route::get('/user/{userId}/product/{productId}', [PromotionsController::class, 'getUserProductPromotions'])->name('promotions.user-product');
                Route::get('/event/{eventName}', [PromotionsController::class, 'getEventPromotions'])->name('promotions.event');
            });
        });
    });
