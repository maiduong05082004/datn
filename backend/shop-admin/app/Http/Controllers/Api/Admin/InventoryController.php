<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariation;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function getObsoleteProducts(Request $request)
    {
        $updatedYears = $request->input('updated_years', 2); // Mặc định là 2 năm
        $purchaseYears = $request->input('purchase_years', 1); // Mặc định là 1 năm
        $maxRemainingSizes = $request->input('remaining_sizes', 2); // Chỉ còn lại tối đa x size

        // Thời gian kiểm tra
        $twoYearsAgo = Carbon::now()->subYears($updatedYears);
        $oneYearAgo = Carbon::now()->subYears($purchaseYears);

        // Lấy các sản phẩm còn lại số lượng ít kích thước hoặc màu sắc
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
            ->whereDoesntHave('billDetails', function ($query) use ($oneYearAgo) {
                $query->where('created_at', '>=', $oneYearAgo); // Không có giao dịch trong vòng 1 năm
            })
            ->paginate(10);

        // Thêm remaining_properties cho từng sản phẩm, nhóm theo màu sắc
        $productsWithFewSizes->getCollection()->transform(function ($product) {
            $remainingProperties = $product->variations->map(function ($variation) {
                // Tên màu sắc của biến thể
                $color = $variation->attributeValue->value;

                // Nhóm các kích thước còn tồn kho theo màu sắc
                $sizes = $variation->variationValues->where('stock', '>', 0)->map(function ($value) {
                    return [
                        'size' => $value->attributeValue->value, // Kích thước (S, M, L, ...)
                        'stock' => $value->stock, // Số lượng tồn kho của kích thước này
                    ];
                });

                return [
                    'color' => $color, // Màu sắc của biến thể
                    'sizes' => $sizes, // Các kích thước và số lượng tồn kho theo kích thước
                ];
            })->filter(function ($item) {
                return $item['sizes']->isNotEmpty(); // Chỉ lấy các thuộc tính còn tồn kho
            })->values()->toArray();

            $product->remaining_properties = $remainingProperties;

            return $product;
        });

        return response()->json([
            'obsolete_products' => $productsWithFewSizes,
        ]);
    }
}
