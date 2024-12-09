<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GroupResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\VariationResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariationValue;
use App\Models\TableProductCost;
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

    public function getInStockBySize(Request $request)
    {
        // Lấy giá trị remaining_sizes từ request (hoặc mặc định là 200)
        $maxRemainingSizes = $request->input('remaining_sizes', 20);

        // Lọc các sản phẩm có tồn kho size lẻ
        $productsWithFewSizes = Product::whereHas('variations.variationValues', function ($query) {
            $query->where('stock', '>', 0); // Lọc các biến thể còn hàng (stock > 0)
        })
            ->whereHas('variations', function ($query) use ($maxRemainingSizes) {
                // Đếm số biến thể còn hàng
                $query->withCount(['variationValues' => function ($subQuery) {
                    $subQuery->where('stock', '>', 0);
                }])
                    // Kiểm tra số lượng size lẻ, chỉ lấy sản phẩm có size lẻ <= maxRemainingSizes
                    ->having('variation_values_count', '<=', $maxRemainingSizes);
            })
            ->paginate(10); // Phân trang, lấy 10 sản phẩm mỗi trang

        // Thêm status_messages cho từng sản phẩm
        $productsWithFewSizes->getCollection()->transform(function ($product) use ($maxRemainingSizes) {
            $statusMessages = [];

            // Lấy tất cả các size còn tồn kho
            $remainingSizes = $product->variations->flatMap(function ($variation) {
                return $variation->variationValues->where('stock', '>', 0)->pluck('attributeValue.value');
            })->unique()->values();

            // Kiểm tra xem sản phẩm có size lẻ không và có ít hơn hoặc bằng số size lẻ tối đa
            if ($remainingSizes->count() <= $maxRemainingSizes) {
                $sizes = $remainingSizes->implode(', '); // Chuyển mảng thành chuỗi
                $statusMessages[] = "Chỉ còn size lẻ: {$sizes}"; // Thêm thông báo size lẻ
            }

            // Gán status_messages vào sản phẩm
            $product->status_messages = $statusMessages;

            return $product; // Trả lại sản phẩm đã được cập nhật
        });

        // Chuyển đổi các sản phẩm thành định dạng Resource (để trả về kết quả)
        $productsWithFewSizes = $productsWithFewSizes->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'stock' => $product->stock,
                'description' => $product->description,
                'category_name' => $product->category->name,
                'group' => $product->group ? new GroupResource($product->group) : null,
                'variations' => $product->variations->isNotEmpty() ? VariationResource::collection($product->variations) : [],
                'status_messages' => $product->status_messages, // Đảm bảo status_messages được đưa vào kết quả
            ];
        });

        // Trả về kết quả dưới dạng JSON
        return response()->json([
            'data' => $productsWithFewSizes,
        ]);
    }




    // tồn kho

    //list sản phẩm đang bán
    public function listProductActive()
    {
        $products = Product::with(
            [
                'variations.attributeValue',
                'variations.group',
                'variations.variationValues',
                'variations.variationImages',
                'cost'
            ]
        )
            ->whereHas('cost', function ($query) {
                $query->where('sale_status', TableProductCost::SALE_STATUS_ACTIVE);
            })
            ->paginate(10);


        return response()->json([
            'data' =>  ProductResource::collection($products),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ], 200);
    }

    //list sản phẩm Hàng tồn(ngưng bán)

    public function listProductInactive()
    {
        $products = Product::with(
            [
                'variations.attributeValue',
                'variations.group',
                'variations.variationValues',
                'variations.variationImages',
                'cost'
            ]
        )
            ->whereHas('cost', function ($query) {
                $query->where('sale_status', TableProductCost::SALE_STATUS_INACTIVE);
            })
            ->paginate(10);


        return response()->json([
            'data' =>  ProductResource::collection($products),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ], 200);
    }

    // ngưng bán sản phẩm
    public function updateProductInactive($id)
    {
        $product = Product::findOrFail($id);
        $product->cost()->update([
            'sale_status' => TableProductCost::SALE_STATUS_INACTIVE,
            'sale_end_date' => now(),
        ]);

        return response()->json(['message' => 'sản phẩm đã đưa vào tồn kho tức là ngừng bán'], 200);
    }

    // mở bán sản phẩm

    public function updateProductActivete($id)
    {
        $product = Product::findOrFail($id);
        $product->cost()->update([
            'sale_status' => TableProductCost::SALE_STATUS_ACTIVE,
            'sale_start_date' => now(),
        ]);

        return response()->json(['message' => 'sảm phẩm đã mở bán.'], 200);
    }


    // danh sách sản phẩmb đang bán có các size sắp hết hàng
    public function listProductsWithFewSizes(Request $request)
    {
        $maxStock = $request->input('max_stock', 10);
        $products = Product::with('variations.variationValues')
            ->whereHas('variations.variationValues', function ($query) use ($maxStock) {
                $query->where('stock', '<=', $maxStock);
            })
            ->whereHas(
                'cost',
                function ($query) {
                    $query->where('sale_status', TableProductCost::SALE_STATUS_ACTIVE);
                }
            )

            ->paginate(10);

        return response()->json([
            'data' => ProductResource::collection($products),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ], 200);
    }

    // cập nhật lại sô lượng mới
    public function updateStockProduct($id, Request $request)
    {
        $productVariationValue = ProductVariationValue::findOrFail($id);

        $productVariationValue->stock += $request->input('stock');
        $productVariationValue->save();

        $productVariation = $productVariationValue->productVariation;
        $productVariation->stock += $request->input('stock');
        $productVariation->save();

        $product = $productVariation->product;
        $product->stock += $request->input('stock');
        $product->save();

        return response()->json([
            'message' => 'Đã cập nhật số lượng thành công cho size ' . $productVariationValue->attributeValue->value . ' với số lượng là ' . $request->input('stock')
        ]);
    }

    // chuyển đổi vào danh muc giảm giá
    public function saleCategory($id, Request $request)
    {

        $product = Product::findOrFail($id);

        $product->update([
            'category_id' => $request->category_id
        ]);
        return response()->json([
            'message' => 'đã chuyển đổi danh mục'
        ]);
    }

    // danh sách sản phẩm hết hàng
    public function productIsOutOfStock()
    {
        $product = Product::with(['variations.variationValues'])
            ->where('stock', 0)
            ->WhereHas('variations.variationValues', function ($query) {
                $query->where('stock', 0);
            })
            ->get();

        return response()->json([
            'data' => ProductResource::collection($product)
        ]);
    }


    

// bộ lọc tồn kho
    
    public function listProductsByDateAndSupplier(Request $request)
    {
        $startDate = $request->input('start_date'); 
        $endDate = $request->input('end_date'); 
        $supplier = $request->input('supplier');
        $categoryId = $request->input('category_id'); 
        
        $products = Product::with(
            [
                'variations.attributeValue',
                'variations.group',
                'variations.variationValues',
                'variations.variationImages',
                'cost'
            ]
        )
        ->whereHas('cost', function ($query) use ($startDate, $endDate, $supplier, $categoryId) {
            if ($startDate && $endDate) {
                $query->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('sale_start_date', [$startDate, $endDate])
                      ->orWhereBetween('sale_end_date', [$startDate, $endDate]);
                });
            } elseif ($startDate) {
                $query->where('sale_start_date', '>=', $startDate);
            } elseif ($endDate) {
          
                $query->where('sale_end_date', '<=', $endDate);
            }
    
            if ($supplier) {
                $query->where('supplier', 'LIKE', '%' . $supplier . '%');
            }
    
            if ($categoryId) {
                $category = Category::find($categoryId);
    
                if ($category) {
                    // Lấy tất cả danh mục con của danh mục hiện tại (bao gồm danh mục con của các danh mục con)
                    $childCategories = $category->childrenRecursive()->pluck('id')->toArray(); // Lấy tất cả id danh mục con
                    $childCategories[] = $category->id; // Thêm danh mục cha vào danh sách
    
                    $query->whereIn('category_id', $childCategories);
                }
            }
        })
        ->paginate(10); 
    
        return response()->json([
            'data' => ProductResource::collection($products),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ], 200);
    }
    

    
}
