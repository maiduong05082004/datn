<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Auth;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    // list
    public function index()
    {
        $wishlist = Auth::user()->wishlist()->with('wishlistedBy')->get();
        return response()->json([
            'is_active' => 'success',
            'data' => $wishlist
        ], 200);
    }

    // check và add
    public function AddToWishlist($productId)
    {
        $user = Auth::user();
        $product = Product::findOrFail($productId);

        if ($user->wishlist()->where('product_id', $productId)->exists()) {
            return response()->json([
                'is_active' => 'info',
                'message' => 'Sản phẩm đã có trong danh sách yêu thích'
            ], 200);
        }

        $user->wishlist()->attach($product);
        return response()->json([
            'is_active' => 'success',
            'message' => 'Sản phẩm đã được thêm vào danh sách yêu thích'
        ], 201);
    }

    // delete
    public function destroy($productId)
    {
        $user = Auth::user();
        $product = Product::findOrFail($productId);

        if (!$user->wishlist()->where('product_id', $productId)->exists()) {
            return response()->json([
                'is_active' => 'error',
                'message' => 'Sản phẩm không có trong wishlist'
            ], 404);
        }

        $user->wishlist()->detach($product);
        return response()->json([
            'status' => 'success',
            'message' => 'Sản phẩm đã được xóa khỏi danh sách yêu thích'
        ], 200);
    }
}
