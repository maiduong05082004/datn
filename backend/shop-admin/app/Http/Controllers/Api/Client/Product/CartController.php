<?php

namespace App\Http\Controllers\Api\Client\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\VariationValueResource;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariationValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{





public function getCartItems()
{
    $user = Auth::user();

    $cartItems = CartItem::with([
        'product.category',
        'product.variations.group',
        'product.variations.attributeValue',
        'product.variations.variationValues',
        'product.variations.variationImages',
        'product.images',
        'productVariationValue'
    ])->where('user_id', $user->id)->get();


    $groupedData = $cartItems->groupBy('user_id')->map(function ($items, $userId) {
        return [
            'user_id' => $userId,
            'cart_items' => $items->map(function ($cartItem) {
                $productResource = new ProductResource($cartItem->product); // Sử dụng ProductResource
                $selectedVariationValue = $cartItem->productVariationValue;

                return [
                    'cart_item_id' => $cartItem->id,
                    'quantity' => $cartItem->quantity,
                    'product' => $productResource, // Đưa vào ProductResource để hiển thị sản phẩm
                    'variation_id' => $selectedVariationValue->product_variation_id ?? null,
                    'variation_values' => [
                        'id' => $selectedVariationValue->id,
                        'attribute_value_id' => $selectedVariationValue->attribute_value_id,
                        'value' => $selectedVariationValue->attributeValue->value ?? null,
                        'sku' => $selectedVariationValue->sku,
                        'stock' => $selectedVariationValue->stock,
                        'price' => (float) $selectedVariationValue->price,
                        'discount' => $selectedVariationValue->discount,
                    ],
                ];
            }),
        ];
    });


    $result = $groupedData->first();

    return response()->json($result, 200);
}


 
    public function addToCart(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'product_variation_value_id' => 'required|exists:product_variation_values,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $user = Auth::user();

    // Kiểm tra tồn kho của biến thể
    $variation = ProductVariationValue::findOrFail($validated['product_variation_value_id']);
    
    // Tính tổng số lượng hiện có trong giỏ hàng cho biến thể này
    $cartItem = CartItem::where('user_id', $user->id)
        ->where('product_variation_value_id', $validated['product_variation_value_id'])
        ->first();

    $existingQuantity = $cartItem ? $cartItem->quantity : 0;
    $totalQuantity = $existingQuantity + $validated['quantity'];

    if ($variation->stock < $totalQuantity) {
        return response()->json([
            'message' => 'Sản phẩm không đủ số lượng trong kho',
            'available_stock' => $variation->stock
        ], 400);
    }

    // Thêm sản phẩm vào giỏ hàng hoặc tăng số lượng
    if ($cartItem) {
        $cartItem->increment('quantity', $validated['quantity']);
    } else {
        CartItem::create([
            'user_id' => $user->id,
            'product_id' => $validated['product_id'],
            'product_variation_value_id' => $validated['product_variation_value_id'],
            'quantity' => $validated['quantity'],
        ]);
    }

    return response()->json([
        'message' => 'Thêm vào giỏ hàng thành công'
    ], 201);
}


public function updateCartItem(Request $request, $id)
{
    $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'product_variation_value_id' => 'required|exists:product_variation_values,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $user = Auth::user();

    // Lấy mục giỏ hàng hiện tại
    $currentCartItem = CartItem::where('id', $id)
        ->where('user_id', $user->id)
        ->firstOrFail();

    // Kiểm tra tồn kho
    $variation = ProductVariationValue::findOrFail($validated['product_variation_value_id']);
    $existingCartItem = CartItem::where('user_id', $user->id)
        ->where('product_id', $validated['product_id'])
        ->where('product_variation_value_id', $validated['product_variation_value_id'])
        ->where('id', '!=', $id)
        ->first();

    $existingQuantity = $existingCartItem ? $existingCartItem->quantity : 0;
    $totalQuantity = $existingQuantity + $validated['quantity'];

    if ($variation->stock < $totalQuantity) {
        return response()->json([
            'message' => 'Sản phẩm không đủ số lượng trong kho',
            'available_stock' => $variation->stock
        ], 400);
    }

    // Cập nhật giỏ hàng hoặc gộp mục giỏ hàng tương tự
    if ($existingCartItem) {
        $existingCartItem->increment('quantity', $validated['quantity']);
        $currentCartItem->delete();
    } else {
        $currentCartItem->update([
            'product_id' => $validated['product_id'],
            'product_variation_value_id' => $validated['product_variation_value_id'],
            'quantity' => $validated['quantity'],
        ]);
    }

    // Lấy danh sách giỏ hàng mới nhất sau khi cập nhật
    $cartItems = CartItem::with(['product', 'productVariationValue'])
        ->where('user_id', $user->id)
        ->get();

    return response()->json([
        'message' => 'Cập nhật giỏ hàng thành công',
        'data' => $cartItems,
    ], 200);
}


    /**
     * Xóa sản phẩm khỏi giỏ hàng.
     */
    public function removeCartItem($id)
    {
        $user = Auth::user();
        $cartItem = CartItem::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $cartItem->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công'
        ], 200);
    }
}
