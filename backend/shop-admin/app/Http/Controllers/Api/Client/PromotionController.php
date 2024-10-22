<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Promotion;
use App\Models\User;
use App\Models\UserPromotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function applyPromotion(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'codes' => 'required|array',
            'codes.*' => 'string|exists:promotions,code',
        ]);

        $user = User::find($request->user_id);
        $appliedPromotions = [];

        foreach ($request->codes as $code) {
            $promotion = Promotion::where('code', $code)
                ->where('is_active', true)
                ->where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->first();

            if (!$promotion) {
                return response()->json(['message' => "Mã $code không hợp lệ hoặc đã hết hạn."], 422);
            }

            if ($promotion->promotion_type === 'shipping') {
                $usedShippingPromotion = UserPromotion::where('user_id', $user->id)
                    ->whereHas('promotion', function ($query) {
                        $query->where('promotion_type', 'shipping');
                    })
                    ->first();

                if ($usedShippingPromotion) {
                    return response()->json(['message' => 'Bạn chỉ có thể áp dụng 1 mã khuyến mãi liên quan đến phí vận chuyển.'], 422);
                }
            }

            $usedPromotion = UserPromotion::where('user_id', $user->id)
                ->where('promotion_id', $promotion->id)
                ->first();

            if ($usedPromotion) {
                return response()->json(['message' => "Mã $code đã được sử dụng."], 422);
            }

            UserPromotion::create([
                'user_id' => $user->id,
                'promotion_id' => $promotion->id,
            ]);

            $appliedPromotions[] = $code;
        }

        return response()->json([
            'message' => 'Áp dụng mã khuyến mãi thành công!',
            'applied_promotions' => $appliedPromotions
        ], 200);
    }




    public function getAvailablePromotions(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Không thể xác thực người dùng'], 401);
        }

        $promotions = Promotion::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereDoesntHave('userPromotions', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        return response()->json($promotions, 200);
    }
    public function calculateCartTotal($userId)
    {
        $cartItems = CartItem::where('user_id', $userId)
            ->with('productVariation.variationValues')
            ->get();

        $total = $cartItems->sum(function ($item) {
            $price = 0;

            if ($item->productVariation && $item->productVariation->variationValues->isNotEmpty()) {
                $price = $item->productVariation->variationValues->first()->price;
            } elseif ($item->product) {
                $price = $item->product->price;
            }

            return $price * $item->quantity;
        });

        return $total;
    }
    public function getPromotionHistory(Request $request)
    {
        $user = $request->user();

        $history = UserPromotion::where('user_id', $user->id)
            ->with('promotion')
            ->get();

        return response()->json($history, 200);
    }

    public function checkPromotion(Request $request)
    {
        $promotion = Promotion::where('code', $request->code)
            ->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (!$promotion) {
            return response()->json(['message' => 'Mã không hợp lệ hoặc đã hết hạn.'], 422);
        }

        return response()->json($promotion, 200);
    }
    public function getProductPromotions($productId)
    {
        $promotions = Promotion::where('product_id', $productId)
            ->orWhereHas('category', function ($query) use ($productId) {
                $query->whereHas('products', function ($productQuery) use ($productId) {
                    $productQuery->where('id', $productId);
                });
            })
            ->where('is_active', true)
            ->get();

        if ($promotions->isEmpty()) {
            return response()->json(['message' => 'Không có khuyến mãi cho sản phẩm này.'], 404);
        }

        return response()->json(['promotions' => $promotions], 200);
    }
}
