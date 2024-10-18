<?php

namespace App\Http\Controllers\Api\Admin\Cart;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Auth;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Auth::user()->cartItems()->with('product')->get();
        return response()->json($cartItems);
    }
    public function add(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $user = Auth::user();
        $product = Product::findOrFail($productId);

        $maxQuantity = 5;
        if ($request->quantity > $product->stock) {
            return response()->json(['error' => 'Số lượng yêu cầu vượt quá số lượng tồn kho']);
        }
        if ($request->quantity > $maxQuantity) {
            return response()->json(['error' => 'Mỗi item mua tối đa 5 sản phẩm']);
        }
        $totalPrice = $product->price * $request->quantity;
        $cartItem = $user->cartItems()->updateOrCreate(
            ['product_id' => $productId],
            [
                'quantity' => $request->quantity,
                'total_price' => $totalPrice,
            ]
        );
        $this->updateTotalCartPrice($user);
        return response()->json([
            'message' => 'Đã thêm vào giỏ hàng thành công',
            'product_name' => $product->name,
            'product_price' => $product->price,
            'total_price' => $totalPrice
        ]);
    }

    public function destroy($productId)
    {
        $user = Auth::user();
        $cartItem = $user->cartItems()->where('product_id', $productId)->firstOrFail();
        $cartItem->delete();

        $this->updateTotalCartPrice($user);

        return response()->json([
            'message' => 'Sản phẩm đã xóa khỏi giỏ hàng',
            'total_price_after_removal' => $this->getTotalCartItem(),
        ]);
    }
    private function updateTotalCartPrice($user)
    {
        $totalPrice = $user->cartItems()->sum('total_price');
        $user->update(['total_cart_price' => $totalPrice]);
    }
}
