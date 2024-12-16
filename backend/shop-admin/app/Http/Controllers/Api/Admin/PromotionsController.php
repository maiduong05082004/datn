<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\Product;
use App\Models\User;
use App\Models\Promotion;
use App\Models\Wishlist;
use App\Models\WishlistItem;
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
        $userWishlistedProduct = WishlistItem::where('user_id', $userId)
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
        $categories = Category::whereIn('id', $promotions->pluck('category_ids')->flatten())->get(['id', 'name']);
        $products = Product::whereIn('id', $promotions->pluck('product_ids')->flatten())->get(['id', 'name']);

        $formattedPromotions = $promotions->map(function ($promotion) use ($categories, $products) {
            $promotionCategories = $categories
                ->whereIn('id', $promotion->category_ids)
                ->map(fn($cat) => ['id' => $cat->id, 'name' => $cat->name])
                ->values()
                ->toArray();

            $promotionProducts = $products
                ->whereIn('id', $promotion->product_ids)
                ->map(fn($prod) => ['id' => $prod->id, 'name' => $prod->name])
                ->values()
                ->toArray();

            return [
                'id' => $promotion->id,
                'code' => $promotion->code,
                'description' => $promotion->description,
                'start_date' => $promotion->start_date,
                'end_date' => $promotion->end_date,
                'discount_amount' => $promotion->discount_amount,
                'discount_type' => $promotion->discount_type,
                'max_discount_amount' => $promotion->max_discount_amount,
                'usage_limit' => $promotion->usage_limit,
                'min_order_value' => $promotion->min_order_value,
                'promotion_type' => $promotion->promotion_type,
                'promotion_subtype' => $promotion->promotion_subtype,
                'is_active' => $promotion->is_active,
                'status' => $promotion->status,
                'created_at' => $promotion->created_at,
                'updated_at' => $promotion->updated_at,
                'categories' => $promotionCategories,
                'products' => $promotionProducts,
            ];
        });

        return response()->json(['data' => $formattedPromotions], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:promotions,code',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount_amount' => 'required|numeric|min:0',
            'discount_type' => 'required|in:amount,percent',
            'max_discount_amount' => 'nullable|required_if:discount_type,percent|numeric|min:0',
            'promotion_type' => 'required|in:shipping,product',
            'promotion_subtype' => 'required|in:first_order,product_discount,voucher_discount,shipping',
            'category_ids' => 'array|nullable',
            'category_ids.*' => 'exists:categories,id',
            'product_ids' => 'array|nullable',
            'product_ids.*' => 'exists:products,id',
            'usage_limit' => 'nullable|integer|min:1',
            'status' => 'required|in:active,expired,upcoming,disabled',
            'is_active' => 'boolean',
        ]);
    
        $promotion = new Promotion($request->all());
        $promotion->category_ids = $request->category_ids;
        $promotion->product_ids = $request->product_ids;
        $promotion->is_active = $request->is_active ?? false;
        $promotion->save();
    
        return response()->json($promotion, 201);
    }
    

    public function show($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Khuyến mãi không tồn tại.'], 404);
        }

        $categories = Category::whereIn('id', $promotion->category_ids)->get(['id', 'name']);
        $products = Product::whereIn('id', $promotion->product_ids)->get(['id', 'name']);

        $promotionCategories = $categories->map(fn($cat) => [
            'id' => $cat->id,
            'name' => $cat->name,
        ])->values()->toArray();

        $promotionProducts = $products->map(fn($prod) => [
            'id' => $prod->id,
            'name' => $prod->name,
        ])->values()->toArray();

        $formattedPromotion = [
            'id' => $promotion->id,
            'code' => $promotion->code,
            'description' => $promotion->description,
            'start_date' => $promotion->start_date,
            'end_date' => $promotion->end_date,
            'discount_amount' => $promotion->discount_amount,
            'discount_type' => $promotion->discount_type,
            'max_discount_amount' => $promotion->max_discount_amount,
            'usage_limit' => $promotion->usage_limit,
            'min_order_value' => $promotion->min_order_value,
            'promotion_type' => $promotion->promotion_type,
            'promotion_subtype' => $promotion->promotion_subtype,
            'is_active' => $promotion->is_active,
            'status' => $promotion->status,
            'created_at' => $promotion->created_at,
            'updated_at' => $promotion->updated_at,
            'categories' => $promotionCategories,
            'products' => $promotionProducts,
        ];

        return response()->json($formattedPromotion, 200);
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
        'discount_type' => 'required|in:amount,percent',
        'max_discount_amount' => 'nullable|required_if:discount_type,percent|numeric|min:0',
        'promotion_type' => 'required|in:shipping,product',
        'promotion_subtype' => 'required|in:first_order,product_discount,voucher_discount,shipping',
        'category_ids' => 'array|nullable',
        'category_ids.*' => 'exists:categories,id',
        'product_ids' => 'array|nullable',
        'product_ids.*' => 'exists:products,id',
        'usage_limit' => 'nullable|integer|min:1',
        'status' => 'required'
    ]);

    $promotion->update($request->except(['category_ids', 'product_ids']));
    $promotion->category_ids = $request->category_ids;
    $promotion->product_ids = $request->product_ids;
    $promotion->save();

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
