<?php

use App\Http\Controllers\Api\Admin\Product\ProductController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Client\AuthController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Client\CategoryController;
use App\Http\Controllers\Api\Client\Product\ProductController as ClientProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\InventoryController;
use App\Http\Controllers\Api\Admin\Product\AttributeController;
use App\Http\Controllers\Api\Admin\Product\AttributeGroupController;
use App\Http\Controllers\Api\Admin\Product\AttributeValueController;
use App\Http\Controllers\Api\Admin\Product\OrderController;
use App\Http\Controllers\Api\Admin\Product\ShippingController as ProductShippingController;
use App\Http\Controllers\Api\Admin\PromotionsController;
use App\Http\Controllers\Api\Client\HomeController;
use App\Http\Controllers\Api\Client\Product\ProductController as ProductProductController;
use App\Http\Controllers\Api\Admin\WishlistController;
use App\Http\Controllers\Api\Client\CheckoutController;
use App\Http\Controllers\Api\Client\Product\CartController as ProductCartController;
use App\Http\Controllers\Api\Client\Product\ShippingController;
use App\Http\Controllers\Api\Client\PromotionController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Api\Admin\PaymentController;
use App\Http\Controllers\Api\Client\CommentController;

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
        Route::get('/showDetail/{id}', [ProductProductController::class, 'showDetail'])->name('showDetail');
        Route::post('/purchase', [ProductProductController::class, 'purchase'])->name('purchase')->middleware('auth:sanctum');
        Route::get('/', [ProductProductController::class, 'index'])->name('index');
        Route::get('/showDetailOrder/{oderId}', [ProductProductController::class, 'showDetailOrder'])->name('showDetailOrder');
        Route::post('orders/cancel/{orderId}', [ProductProductController::class, 'cancelOrder']);
        Route::post('orders/confirm/{orderId}', [ProductProductController::class, 'confirmOrder']);
    });
    Route::prefix('cart')->as('cart.')->middleware('auth:sanctum')->group(function () {
        Route::get('/', [ProductCartController::class, 'getCartItems'])->name('index');
        Route::post('/add', [ProductCartController::class, 'addToCart'])->name('add');
        Route::put('/update/{id}', [ProductCartController::class, 'updateCartItem'])->name('update');
        Route::delete('/{id}', [ProductCartController::class, 'removeCartItem'])->name('remove');
    });
    Route::prefix('wishlist')->as('wishlist.')->middleware('auth:sanctum')->group(function () {
        Route::post('/add', [WishlistController::class, 'addToWishlist'])->name('wishlist.add');
        Route::get('/', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::delete('/remove/{id}', [WishlistController::class, 'destroy'])->name('wishlist.remove');
    });
    Route::prefix('checkout')->as('checkout.')->group(function () {
        Route::post('/', [CheckoutController::class, 'submit'])->name('submit');
        Route::get('/success', [CheckoutController::class, 'success'])->name('success');
        Route::get('/cancel', [CheckoutController::class, 'cancel'])->name('cancel');
        Route::get('/callback', [CheckoutController::class, 'vnpayCallback'])->name('callback');
    });
    Route::prefix('comment')->as('comment.')->group(function () {
        Route::post('/store', [CommentController::class, 'store'])->name('comment.store'); // Tạo 1 bình luận
        Route::put('/update', [CommentController::class, 'update'])->name('comment.update'); // Cập nhật bình luận
        Route::delete('/destroy', [CommentController::class, 'destroy'])->name('comment->destroy'); // Xóa bình luận bên giao diện
        Route::get('/rating', [CommentController::class, 'getProductRating'])->name('comment.rating'); // Trung bình số sao đánh giá

        //     Route::post('approve', [CommentController::class, 'approve'])->name('comment.approve'); // Duyệt bình luận
        //     Route::post('/reply', [CommentController::class, 'reply'])->name('comment.reply'); // Admin trả lời bình luận của user
        //     Route::post('/hide', [CommentController::class, 'hideComment'])->name('comment.hide'); // Ẩn bình luận nếu vi phạm 
        //     Route::post('/report', [CommentController::class, 'report'])->name('comment.report'); // Báo cáo bình luận
        //     Route::post('/manageUser', [CommentController::class, 'manageUser'])->name('comment.manageUser'); // quản lý user (khóa nếu comment bị báo cáo nhiều)
    });
});


Route::prefix('admins')
    ->as('admins.')
    ->group(function () {
        Route::post('/signin', [AdminAuthController::class, 'login'])->name('signin');
        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::apiResource('products', ProductController::class)
                ->names('products');
            Route::delete('images/{type}/{encodedPath}', [ProductController::class, 'deleteImageByPath'])->name('images.deleteByPath');
            Route::apiResource('attributes', AttributeController::class)
                ->names('attributes');

            Route::apiResource('attribute_groups', AttributeGroupController::class)
                ->names('attribute_groups');
            Route::delete('attribute_groups/{group_id}/attributes/{attribute_id}', [AttributeGroupController::class, 'destroyAttribute']);

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
            });
            Route::prefix('promotions')->group(function () {
                Route::get('/new-users', [PromotionsController::class, 'getNewUserPromotions'])->name('promotions.new-users');
                Route::get('/', [PromotionsController::class, 'index'])->name('promotions.index');
                Route::post('/', [PromotionsController::class, 'store'])->name('promotions.store');
                Route::get('/{id}', [PromotionsController::class, 'show'])->name('promotions.show');
                Route::put('/{id}', [PromotionsController::class, 'update'])->name('promotions.update');
                Route::delete('/{id}', [PromotionsController::class, 'destroy'])->name('promotions.destroy');
                Route::get('/user/{userId}/product/{productId}', [PromotionsController::class, 'getUserProductPromotions'])->name('promotions.user-product');
                Route::get('/event/{eventName}', [PromotionsController::class, 'getEventPromotions'])->name('promotions.event');
                Route::post('/products/by-ids', [ProductController::class, 'getProductsByIds'])->name('products.by-ids');
            });
            Route::prefix('orders')->group(function () {
                Route::get('/', [OrderController::class, 'index'])->name('orders.index');
                Route::get('/pending', [OrderController::class, 'pendingOrders'])->name('orders.pending');
                Route::get('/processed', [OrderController::class, 'processedOrders'])->name('orders.processed');
                Route::get('/shipped', [OrderController::class, 'shippedOrders'])->name('orders.shipped');
                Route::get('/delivered', [OrderController::class, 'deliveredOrders'])->name('orders.delivered');
                Route::get('/canceled', [OrderController::class, 'canceledOrders'])->name('orders.canceled');
                Route::post('/search_order', [OrderController::class, 'searchOrder'])->name('orders.searchorder');
                Route::post('/search-pending', [OrderController::class, 'searchPendingOrder'])->name('orders.searchpending');
                Route::post('/search-processed', [OrderController::class, 'searchProcessedOrder'])->name('orders.searchprocessed');
                Route::post('/search-shipped', [OrderController::class, 'searchShippedOrder'])->name('orders.searchshipped');
                Route::post('/search-delivered', [OrderController::class, 'searchDeliveredOrder'])->name('orders.searchdelivered');
                Route::post('/search-canceled', [OrderController::class, 'searchCanceledOrder'])->name('orders.searchcanceled');
                Route::get('/show_detailorder/{id}', [OrderController::class, 'showDetailOrder'])->name('orders.showdetailorder');
                Route::post('/update_order/{id}', [OrderController::class, 'updateOrderStatus'])->name('orders.updateorder');
                Route::post('/ghn-create/{billId}', [ProductShippingController::class, 'createGHNOrderFromBill'])->name('orders.createGHNOrder');
                Route::post('/ghn-detail/{billId}', [ProductShippingController::class, 'getGHNOrderDetail'])->name('orders.getGHNOrderDetail');
                Route::post('/ghn-cancel/{billId}', [ProductShippingController::class, 'cancelGHNOrder'])->name('orders.cancelGHNOrder');
                Route::post('/ghn-update/{billId}', [ProductShippingController::class, 'updateGHNOrder'])->name('orders.updateGHNOrder');
            });
            Route::prefix('comment')->as('comment.')->group(function () {
                Route::get('/list', [CommentController::class, 'index'])->name('comment.list'); // Lấy list bình luận đã duyệt theo user_id & product_id
                Route::post('approve', [CommentController::class, 'approve'])->name('comment.approve'); // Duyệt bình luận
                Route::post('/reply', [CommentController::class, 'reply'])->name('comment.reply'); // Admin trả lời bình luận của user
                Route::post('/hide', [CommentController::class, 'hideComment'])->name('comment.hide'); // Ẩn bình luận nếu vi phạm 
                Route::post('/report', [CommentController::class, 'report'])->name('comment.report'); // Báo cáo bình luận
                Route::post('/manageUser', [CommentController::class, 'manageUser'])->name('comment.manageUser'); // quản lý user (khóa nếu comment bị báo cáo nhiều)
            });

            Route::prefix('inventory')->as('inventory.')->group(function () {
                Route::post('/', [InventoryController::class, 'getObsoleteProducts'])->name('obsolete');
            });
        });
    });
