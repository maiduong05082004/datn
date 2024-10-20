<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Models\Promotion;
use App\Models\Wishlist;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PromotionsController extends Controller
{
    public function getNewUserPromotions()
    {
        $newUsers = User::where('created_at', '>=', Carbon::now()->subMonth())->pluck('id');

        $promotions = Promotion::whereHas('userPromotions', function ($query) use ($newUsers) {
            $query->whereIn('user_id', $newUsers);
        })->get();

        return response()->json(['promotions' => $promotions], 200);
    }

    public function getUserProductPromotions($userId, $productId)
    {
        $userWishlistedProduct = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
        if ($userWishlistedProduct) {
            $promotions = Promotion::whereHas('userPromotions', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->get();

            return response()->json(['promotions' => $promotions], 200);
        } else {
            return response()->json(['message' => 'Không có khuyến mãi nào cho sản phẩm này.'], 404);
        }
    }

    public function getEventPromotions($eventName)
    {
        $event = Event::where('name', $eventName)->first();
        if (!$event) {
            return response()->json(['message' => 'Sự kiện không tồn tại.'], 404);
        }

        $promotions = $event->promotions;
        return response()->json(['promotions' => $promotions], 200);
    }

    public function index(Request $request)
    {
        $promotionType = $request->query('promotion_type');
        $promotions = Promotion::when($promotionType, function ($query, $promotionType) {
            return $query->where('promotion_type', $promotionType);
        })->get();

        return response()->json($promotions, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:promotions,code',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount_amount' => 'required|numeric|min:0',
            'promotion_type' => 'required|in:shipping,product_discount,voucher_discount,first_order',
            'category_id' => 'nullable|exists:categories,id',
            'product_id' => 'nullable|exists:products,id',
            'usage_limit' => 'nullable|integer|min:1',
            'status' => 'required',
        ]);

        $promotion = Promotion::create($request->all());
        return response()->json($promotion, 201);
    }

    public function show($id)
    {
        $promotion = Promotion::find($id);
        if (!$promotion) {
            return response()->json(['message' => 'Khuyến mãi không tồn tại.'], 404);
        }
        return response()->json($promotion, 200);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);
        if (!$promotion) {
            return response()->json(['message' => 'Khuyến mãi không tồn tại.'], 404);
        }
        $request->validate([
            'code' => 'required|unique:promotions,code,' . $id,
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount_amount' => 'required|numeric|min:0',
            'promotion_type' => 'required|in:shipping,product_discount,order_discount,first_order,free_gift',
            'category_id' => 'nullable|exists:categories,id',
            'product_id' => 'nullable|exists:products,id',
            'usage_limit' => 'nullable|integer|min:1',
            'status' => 'required'
        ]);

        $promotion->update($request->all());
        return response()->json($promotion, 200);
    }

    public function destroy($id)
    {
        $promotion = Promotion::find($id);
        if (!$promotion) {
            return response()->json(['message' => 'Khuyến mãi không tồn tại.'], 404);
        }
        $promotion->delete();
        return response()->json(['message' => 'Khuyến mãi đã được xóa.'], 200);
    }
}
