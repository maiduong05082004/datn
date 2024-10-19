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
        $userWishlistedProduct = Wishlist::where('user_id', $userId)->where('product_id', $productId)->exists();

        if ($userWishlistedProduct) {
            $promotions = Promotion::whereHas('userPromotions', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->get();

            return response()->json(['promotions' => $promotions], 200);
        } else {
            return response()->json(['message' => 'No promotions available for this product.'], 404);
        }
    }

    public function getEventPromotions($eventName)
    {
        $event = Event::where('name', $eventName)->first();
    
        if (!$event) {
            return response()->json(['message' => 'Event not found.'], 404);
        }
    
        $promotions = $event->promotions;
    
        return response()->json(['promotions' => $promotions], 200);
    }
    public function index()
    {
        $promotions = Promotion::all();
        return response()->json($promotions, 200);
    }

    // Tạo khuyến mãi mới
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:promotions,code',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount_amount' => 'required|numeric|min:0',
        ]);

        $promotion = Promotion::create($request->all());
        return response()->json($promotion, 201);
    }

    // Xem chi tiết khuyến mãi
    public function show($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        return response()->json($promotion, 200);
    }

    // Cập nhật khuyến mãi
    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        $request->validate([
            'code' => 'required|unique:promotions,code,' . $id,
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount_amount' => 'required|numeric|min:0',
        ]);

        $promotion->update($request->all());
        return response()->json($promotion, 200);
    }

    // Xóa khuyến mãi
    public function destroy($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        $promotion->delete();
        return response()->json(['message' => 'Promotion deleted'], 200);
    }
}