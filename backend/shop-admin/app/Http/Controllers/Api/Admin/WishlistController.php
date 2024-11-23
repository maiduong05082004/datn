<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductVariationValue;
use App\Models\WishlistItem;
use Auth;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    // list
    public function index()
    {
        $user = Auth::user();
        $wishlistItems = WishlistItem::with([
            'product.category',
            'product.variations.group',
            'product.variations.attributeValue',
            'product.variations.variationValues',
            'product.variations.variationImages',
            'product.images',
            'productVariationValue'
        ])->where('user_id', $user->id)->get();
        // $wishlist = $user->wishlistItems()->with(['product', 'productVariationValue'])->get();

        if ($wishlistItems->isEmpty()) {
            return response()->json(
                [
                    // 'is_active' => 'info',
                    'user_id' => $user->id,
                    'data' => $wishlistItems,
                ],
                200
            );
        }

        $groupedData = $wishlistItems->groupBy('user_id')->map(function ($items, $userId) {
            return [
                'user_id' => $userId,
                'data' => $items->map(function ($wishlistItems) {
                    $productResource = new ProductResource($wishlistItems->product);
                    // $selectedVariationValue = $wishlistItems->productVariationValue;
                    return [
                        'wishlist_item_id' => $wishlistItems->id,
                        'product' => $productResource,
                        // 'variation_id' => $selectedVariationValue->product_variation_id ?? null,
                        // 'album_images' => $selectedVariationValue->productVariation->variationImages->where('image_type', 'album')->pluck('image_path'),
                        // 'variation_values' => [
                        //     'id' => $selectedVariationValue->id,
                        //     'attribute_value_id' => $selectedVariationValue->attribute_value_id,
                        //     'value' => $selectedVariationValue->attributeValue->value ?? null,
                        //     'sku' => $selectedVariationValue->sku,
                        //     'stock' => $selectedVariationValue->stock,
                        //     'price' => (float) $selectedVariationValue->price,
                        //     'discount' => $selectedVariationValue->discount,
                        // ],
                    ];
                }),
            ];
        });
        $result = $groupedData->first();
        return response()->json($result, 200);

        // foreach ($wishlistItems as $item) {
        //     $productId = $item->product_id;

        //     // Kiểm tra nếu sản phẩm chưa có trong mảng
        //     if (!isset($groupedProducts[$productId])) {
        //         $groupedProducts[$productId] = [
        //             'product' => $item->product,
        //             'variations' => []
        //         ];
        //     }

        //     // Thêm biến thể vào danh sách variations
        //     if ($item->product_variation_value) {
        //         $groupedProducts[$productId]['variations'][] = $item->product_variation_value;
        //     }
        // }

        // // Định dạng lại mảng để trả về danh sách sản phẩm
        // $data = array_values($groupedProducts);

        // return response()->json([
        //     'is_active' => 'success',
        //     'user_id' => $user->id,
        //     'data' => $data
        // ], 200);
    }

    // check và add
    public function AddToWishlist(Request $request)
    {
        // $validated = $request->validate([
        //     'product_id' => 'required|exists:products,id',
        //     'product_variation_value_id' => 'required|exists:product_variation_values,id',
        // ]);

        // $user = Auth::user();
        // $productId = $validated['product_id'];
        // $variationId = $validated['product_variation_value_id'];

        // $product = Product::findOrFail($productId);

        // if ($user->wishlistItems()->where('product_variation_value_id', $variationId)->exists()) {
        //     return response()->json([
        //         'is_active' => 'info',
        //         'message' => 'Sản phẩm đã có trong danh sách yêu thích',
        //     ], 200);
        // }

        // $wishlistItem = $user->wishlistItems()->create([
        //     'product_id' => $productId,
        //     'product_variation_value_id' => $variationId,
        // ]);

        // $productVariationValue = ProductVariationValue::findOrFail($variationId);

        // return response()->json([
        //     'is_active' => 'success',
        //     'message' => 'Sản phẩm đã được thêm vào danh sách yêu thích',
        //     'user_id' => $user->id,
        //     'data' => $product,
        //     'product_variation_value' => $productVariationValue
        // ], 201);
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            // 'product_variation_value_id' => 'required|exists:product_variation_values,id',
        ]);

        $user = Auth::user();
        $productId = $validated['product_id'];
        // $variationId = $validated['product_variation_value_id'];

        // Kiểm tra xem sản phẩm có trong wishlist chưa
        if ($user->wishlistItems()->where('product_id', $productId)->exists()) {
            return response()->json([
                'is_active' => 'info',
                'message' => 'Sản phẩm đã có trong danh sách yêu thích',
            ], 200);
        }

        // Tạo wishlist item mới
        $wishlistItem = $user->wishlistItems()->create([
            'product_id' => $productId,
            // 'product_variation_value_id' => $variationId,
        ]);

        // Tải lại wishlist item với các mối quan hệ cần thiết để cấu trúc trả về như list wishlist
        $wishlistItem->load([
            'product.category',
            'product.variations.group',
            'product.variations.attributeValue',
            'product.variations.variationValues',
            'product.variations.variationImages',
            'product.images',
            // 'productVariationValue'
        ]);

        $productResource = new ProductResource($wishlistItem->product);
        // $selectedVariationValue = $wishlistItem->productVariationValue;

        // Chuẩn bị dữ liệu trả về
        $responseData = [
            'wishlist_item_id' => $wishlistItem->id,
            'product' => $productResource,
            // 'variation_id' => $selectedVariationValue->product_variation_id ?? null,
            // 'album_images' => $selectedVariationValue->productVariation->variationImages->where('image_type', 'album')->pluck('image_path'),
            // 'variation_values' => [
            //     'id' => $selectedVariationValue->id,
            //     'attribute_value_id' => $selectedVariationValue->attribute_value_id,
            //     'value' => $selectedVariationValue->attributeValue->value ?? null,
            //     'sku' => $selectedVariationValue->sku,
            //     'stock' => $selectedVariationValue->stock,
            //     'price' => (float) $selectedVariationValue->price,
            //     'discount' => $selectedVariationValue->discount,

        ];

        return response()->json([
            'is_active' => 'success',
            'message' => 'Sản phẩm đã được thêm vào danh sách yêu thích',
            'user_id' => $user->id,
            'data' => $responseData
        ], 201);
    }

    // delete
    public function destroy($productId)
    {
        $user = Auth::user();

        if (!$user->wishlistItems()->where('product_id', $productId)
            // ->where('product_variation_value_id', $variationId)
            ->exists()) {
            return response()->json([
                'is_active' => 'error',
                'message' => 'Sản phẩm không có trong wishlist'
            ], 404);
        }

        $user->wishlistItems()->where('product_id', $productId)
            // ->where('product_variation_value_id', $variationId)
            ->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sản phẩm đã được xóa khỏi danh sách yêu thích'
        ], 200);
    }
}
