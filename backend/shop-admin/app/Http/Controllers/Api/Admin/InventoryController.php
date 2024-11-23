<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function getObsoleteProducts(Request $request)
    {
        $updatedYears = $request->input('updated_years', 2); // Mặc định là 2 năm
        $purchaseYears = $request->input('purchase_years', 1); // Mặc định là 1 năm
        $maxRemainingSizes = $request->input('remaining_sizes', 200); // Chỉ còn lại tối đa x size

        // Thời gian kiểm tra
        $twoYearsAgo = Carbon::now()->subYears($updatedYears);
        $oneYearAgo = Carbon::now()->subYears($purchaseYears);

        // Lấy các sản phẩm còn lại số lượng ít kích thước hoặc màu sắc và không cập nhật trong 2 năm
        $productsWithFewSizes = Product::whereHas('variations.variationValues', function ($query) {
            $query->where('stock', '>', 0); // Chỉ lấy các biến thể còn hàng
        })
            ->whereHas('variations', function ($query) use ($maxRemainingSizes) {
                $query->withCount(['variationValues' => function ($subQuery) {
                    $subQuery->where('stock', '>', 0); // Đếm các biến thể còn hàng
                }])
                    ->having('variation_values_count', '<=', $maxRemainingSizes); // Chỉ còn lại tối đa số lượng size lẻ
            })
            ->where('updated_at', '<', $twoYearsAgo) // Sản phẩm không được cập nhật trong 2 năm
            ->paginate(10);

        // Thêm remaining_properties và status_messages cho từng sản phẩm
        $productsWithFewSizes->getCollection()->transform(function ($product) use ($twoYearsAgo, $oneYearAgo, $maxRemainingSizes) {
            $statusMessages = [];

            // Kiểm tra điều kiện 1: Không có cập nhật trong 2 năm
            if ($product->updated_at < $twoYearsAgo) {
                $statusMessages[] = "Không có cập nhật trong 2 năm";
            }

            // Kiểm tra điều kiện 2: Chỉ còn size lẻ và không có giao dịch trong 1 năm
            $remainingSizes = $product->variations->flatMap(function ($variation) {
                return $variation->variationValues->where('stock', '>', 0)->pluck('attributeValue.value');
            })->unique()->values();

            if ($remainingSizes->count() <= $maxRemainingSizes && $product->billDetails->where('created_at', '>=', $oneYearAgo)->isEmpty()) {
                $sizes = $remainingSizes->implode(', ');
                $statusMessages[] = "Chỉ còn size lẻ {$sizes}, không có giao dịch trong 1 năm";
            }

            // Kiểm tra điều kiện 3: Không có đơn hàng trong 1 năm qua
            if ($product->billDetails->where('created_at', '>=', $oneYearAgo)->isEmpty()) {
                $statusMessages[] = "Không có đơn hàng trong 1 năm qua";
            }

            // Thêm status_messages vào sản phẩm
            $product->status_messages = $statusMessages;

            // Thêm remaining_properties cho sản phẩm
            $remainingProperties = $product->variations->map(function ($variation) {
                $color = $variation->attributeValue->value;

                $sizes = $variation->variationValues->where('stock', '>', 0)->map(function ($value) {
                    return [
                        'size' => $value->attributeValue->value,
                        'stock' => $value->stock,
                    ];
                });

                return [
                    'color' => $color,
                    'sizes' => $sizes,
                ];
            })->filter(function ($item) {
                return $item['sizes']->isNotEmpty();
            })->values()->toArray();

            $product->remaining_properties = $remainingProperties;

            return $product;
        });

        // Tạo cấu trúc phản hồi đúng như mong muốn
        return response()->json([
            'obsolete_products' => [
                'current_page' => $productsWithFewSizes->currentPage(),
                'data' => $productsWithFewSizes->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'slug' => $product->slug,
                        'name' => $product->name,
                        'price' => $product->price,
                        'stock' => $product->stock,
                        'description' => $product->description,
                        'content' => $product->content,
                        'view' => $product->view,
                        'input_day' => $product->input_day,
                        'category_id' => $product->category_id,
                        'is_collection' => $product->is_collection,
                        'is_hot' => $product->is_hot,
                        'is_new' => $product->is_new,
                        'created_at' => $product->created_at,
                        'updated_at' => $product->updated_at,
                        'deleted_at' => $product->deleted_at,
                        'status_messages' => $product->status_messages,
                        'remaining_properties' => $product->remaining_properties,
                        'variations' => $product->variations->map(function ($variation) {
                            return [
                                'id' => $variation->id,
                                'product_id' => $variation->product_id,
                                'group_id' => $variation->group_id,
                                'attribute_value_id' => $variation->attribute_value_id,
                                'stock' => $variation->stock,
                                'created_at' => $variation->created_at,
                                'updated_at' => $variation->updated_at,
                                'attribute_value' => $variation->attributeValue,
                                'variation_values' => $variation->variationValues->map(function ($value) {
                                    return [
                                        'id' => $value->id,
                                        'product_variation_id' => $value->product_variation_id,
                                        'attribute_value_id' => $value->attribute_value_id,
                                        'sku' => $value->sku,
                                        'stock' => $value->stock,
                                        'price' => $value->price,
                                        'discount' => $value->discount,
                                        'created_at' => $value->created_at,
                                        'updated_at' => $value->updated_at,
                                        'attribute_value' => $value->attributeValue,
                                    ];
                                }),
                            ];
                        }),
                    ];
                }),
                'first_page_url' => $productsWithFewSizes->url(1),
                'from' => $productsWithFewSizes->firstItem(),
                'last_page' => $productsWithFewSizes->lastPage(),
                'last_page_url' => $productsWithFewSizes->url($productsWithFewSizes->lastPage()),
                'next_page_url' => $productsWithFewSizes->nextPageUrl(),
                'path' => $productsWithFewSizes->path(),
                'per_page' => $productsWithFewSizes->perPage(),
                'prev_page_url' => $productsWithFewSizes->previousPageUrl(),
                'to' => $productsWithFewSizes->lastItem(),
                'total' => $productsWithFewSizes->total(),
            ]
        ]);
    }
}
