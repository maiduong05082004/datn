<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Promotion;
use App\Models\User;
use App\Models\UserPromotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PromotionController extends Controller
{
    public function applyPromotion(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'codes' => 'required|array',
            'codes.*' => 'string|exists:promotions,code',
            'order_id' => 'required|exists:orders,id',
        ]);

        $user = User::find($request->user_id);

        foreach ($request->codes as $code) {
            $promotion = Promotion::where('code', $code)
                ->where('is_active', true)
                ->first();

            if (!$promotion) {
                return response()->json(['message' => "Mã $code không hợp lệ."], 422);
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
                'order_id' => $request->order_id,
            ]);
        }

        return response()->json([
            'message' => 'Lưu mã khuyến mãi thành công!',
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
            ->where('promotion_subtype', '!=', 'voucher_discount')
            ->whereDoesntHave('userPromotions', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where(function ($query) {
                $query->whereNull('usage_limit')
                    ->orWhereRaw('(SELECT COUNT(*) FROM user_promotions WHERE promotion_id = promotions.id) < promotions.usage_limit');
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
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token không hợp lệ.'], 401);
        }

        try {
            $user = Auth::guard('api')->user();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Không thể xác thực người dùng.'], 401);
        }

        $request->validate([
            'codes' => 'required|array',
            'codes.*' => 'string|exists:promotions,code',
        ]);

        $codes = array_unique($request->codes);
        $appliedPromotions = [];
        $errors = [];
        $cartItems = CartItem::where('user_id', $user->id)->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Giỏ hàng của bạn đang trống.', 'applied_promotions' => []], 422);
        }

        $orderTotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $promotionByType = [];

        foreach ($codes as $code) {
            $promotion = Promotion::where('code', $code)
                ->where('is_active', true)
                ->where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->first();

            if (!$promotion) {
                $errors[] = "Mã $code không hợp lệ hoặc đã hết hạn.";
                continue;
            }

            $usageCount = UserPromotion::where('promotion_id', $promotion->id)->count();
            if ($promotion->usage_limit && $usageCount >= $promotion->usage_limit) {
                $errors[] = "Mã $code đã đạt giới hạn sử dụng.";
                continue;
            }

            if ($promotion->promotion_type == 'first_order') {
                $orderCount = $user->bill->count();
                if ($orderCount > 0) {
                    $errors[] = 'Mã giảm giá đơn hàng đầu tiên chỉ áp dụng cho khách hàng mới.';
                    continue;
                }
            }

            if ($promotion->min_order_value && $orderTotal < $promotion->min_order_value) {
                $errors[] = "Đơn hàng không đạt giá trị tối thiểu để áp dụng mã $code.";
                continue;
            }

            $applicable = false;

            $promotionProductIds = $promotion->product_ids;
            $promotionCategoryIds = $promotion->category_ids;

            foreach ($cartItems as $item) {
                if (
                    in_array($item->product_id, $promotionProductIds) ||
                    in_array($item->product->category_id, $promotionCategoryIds)
                ) {
                    $applicable = true;
                    break;
                }
            }

            if (!$applicable && in_array($promotion->promotion_type, ['voucher_discount', 'product_discount', 'discount'])) {
                $errors[] = "Mã $code không áp dụng cho sản phẩm trong giỏ hàng.";
                continue;
            }

            $promotionByType[$promotion->promotion_type] = $promotion;
        }

        if (!empty($errors)) {
            return response()->json([
                'message' => 'Có lỗi xảy ra.',
                'errors' => $errors,
                'applied_promotions' => []
            ], 422);
        }

        $discountAmount = 0;
        $appliedPromotions = array_values($promotionByType);

        foreach ($appliedPromotions as $promotion) {
            if ($promotion->discount_type == 'percent') {
                $amount = $orderTotal * ($promotion->discount_amount / 100);
            } else {
                $amount = $promotion->discount_amount;
            }

            if ($promotion->max_discount_amount && $amount > $promotion->max_discount_amount) {
                $amount = $promotion->max_discount_amount;
            }

            $discountAmount += $amount;
        }

        $finalTotal = $orderTotal - $discountAmount;

        return response()->json([
            'message' => 'Mã khuyến mãi hợp lệ!',
            'order_total' => $orderTotal,
            'discount_amount' => $discountAmount,
            'final_total' => $finalTotal,
            'applied_promotions' => $appliedPromotions,
        ], 200);
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
