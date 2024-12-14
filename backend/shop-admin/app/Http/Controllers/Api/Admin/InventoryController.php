<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GroupResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\VariationResource;
use App\Models\Bill;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariationValue;
use App\Models\TableProductCost;
use Carbon\Carbon;
use DB;
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


    public function index()
    {
        $products = Product::with(
            [
                'variations.attributeValue',
                'variations.group',
                'variations.variationValues',
                'variations.variationImages'
            ]
        )
            ->orderBy('id', 'desc')
            ->paginate(10);

        return ProductResource::collection($products);
    }




    //list sản phẩm đang bán
    //list sản phẩm đang bán
    public function listProductActive()
    {
        $products = Product::with([
            'variations.attributeValue',
            'variations.group',
            'variations.variationValues',
            'variations.variationImages',
            'cost'
        ])
            ->whereHas('cost', function ($query) {
                $query->where('sale_status', TableProductCost::SALE_STATUS_ACTIVE);
            })
            ->paginate(10);

        // Áp dụng map() trên items()
        $formattedProducts = collect($products->items())->map(function ($product) {
            // Lấy bản ghi đầu tiên của cost
            $cost = $product->cost->first();

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'stock' => $product->stock,
                'description' => $product->description,
                'content' => $product->content,
                'category_id' => $product->category_id,
                'category_name' => $product->category->name ?? null,
                'is_collection' => $product->is_collection,
                'is_hot' => $product->is_hot,
                'is_new' => $product->is_new,
                'product_cost' => $cost ? [
                    'id' => $cost->id,
                    'product_id' => $cost->product_id,
                    'cost_price' => $cost->cost_price,
                    'quantity' => $cost->quantity,
                    'import_date' => $cost->import_date,
                    'supplier' => $cost->supplier,
                    'sale_status' => $cost->sale_status,
                    'sale_start_date' => $cost->sale_start_date,
                    'sale_end_date' => $cost->sale_end_date,
                ] : null,
                'variations' => $product->variations->map(function ($variation) {
                    return [
                        'id' => $variation->id,
                        'stock' => $variation->stock,
                        'attribute_value_image_variant' => $variation->attributeValue ? [
                            'id' => $variation->attributeValue->id,
                            'value' => $variation->attributeValue->value,
                            'image_path' => $variation->attributeValue->image_path,
                        ] : null,
                        'variation_values' => $variation->variationValues->map(function ($variationValue) {
                            return [
                                'id' => $variationValue->id,
                                'attribute_value_id' => $variationValue->attribute_value_id,
                                'value' => $variationValue->attributeValue->value ?? null,
                                'sku' => $variationValue->sku,
                                'stock' => $variationValue->stock,
                                'price' => $variationValue->price,
                                'discount' => $variationValue->discount,
                            ];
                        }),
                        'variation_album_images' => $variation->variationImages->pluck('image_path'),
                    ];
                }),
                'images' => $product->images->pluck('image_path'),
            ];
        });

        return response()->json([
            'data' => $formattedProducts,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ], 200);
    }



    //list sản phẩm Hàng tồn(ngưng bán)

    public function listProductInactive()
    {
        $products = Product::with([
            'variations.attributeValue',
            'variations.group',
            'variations.variationValues',
            'variations.variationImages',
            'cost'
        ])
            ->whereHas('cost', function ($query) {
                $query->where('sale_status', TableProductCost::SALE_STATUS_INACTIVE);
            })
            ->paginate(10);

        // Áp dụng map() trên items()
        $formattedProducts = collect($products->items())->map(function ($product) {
            // Lấy bản ghi đầu tiên từ cost
            $cost = $product->cost->first();

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'stock' => $product->stock,
                'description' => $product->description,
                'content' => $product->content,
                'category_id' => $product->category_id,
                'category_name' => $product->category->name ?? null,
                'is_collection' => $product->is_collection,
                'is_hot' => $product->is_hot,
                'is_new' => $product->is_new,
                'product_cost' => $cost ? [
                    'id' => $cost->id,
                    'product_id' => $cost->product_id,
                    'cost_price' => $cost->cost_price,
                    'quantity' => $cost->quantity,
                    'import_date' => $cost->import_date,
                    'supplier' => $cost->supplier,
                    'sale_status' => $cost->sale_status,
                    'sale_start_date' => $cost->sale_start_date,
                    'sale_end_date' => $cost->sale_end_date,
                ] : null,
                'variations' => $product->variations->map(function ($variation) {
                    return [
                        'id' => $variation->id,
                        'stock' => $variation->stock,
                        'attribute_value_image_variant' => $variation->attributeValue ? [
                            'id' => $variation->attributeValue->id,
                            'value' => $variation->attributeValue->value,
                            'image_path' => $variation->attributeValue->image_path,
                        ] : null,
                        'variation_values' => $variation->variationValues->map(function ($variationValue) {
                            return [
                                'id' => $variationValue->id,
                                'attribute_value_id' => $variationValue->attribute_value_id,
                                'value' => $variationValue->attributeValue->value ?? null,
                                'sku' => $variationValue->sku,
                                'stock' => $variationValue->stock,
                                'price' => $variationValue->price,
                                'discount' => $variationValue->discount,
                            ];
                        }),
                        'variation_album_images' => $variation->variationImages->pluck('image_path'),
                    ];
                }),
                'images' => $product->images->pluck('image_path'),
            ];
        });

        return response()->json([
            'data' => $formattedProducts,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
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
        $validatedData = $request->validate([
            'stock' => 'required|integer|min:1', // Số lượng bắt buộc
        ]);

        DB::beginTransaction();

        try {
            $productVariationValue = ProductVariationValue::findOrFail($id);
            $productVariationValue->increment('stock', $validatedData['stock']);

            $productVariation = $productVariationValue->productVariation;
            $productVariation->increment('stock', $validatedData['stock']);

            $product = $productVariation->product;
            $product->increment('stock', $validatedData['stock']);


            $lastCost = TableProductCost::where('product_variation_value_id', $productVariationValue->id)
                ->latest('import_date')
                ->first();


            $costPrice = $lastCost->cost_price ?? 0;
            $supplier = $lastCost->supplier ?? 'Unknown';


            TableProductCost::create([
                'product_id' => $product->id,
                'product_variation_value_id' => $productVariationValue->id,
                'quantity' => $validatedData['stock'],
                'cost_price' => $costPrice,
                'supplier' => $supplier,
                'import_date' => now(),
                'sale_status' => TableProductCost::SALE_STATUS_ACTIVE,
                'sale_start_date' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Đã cập nhật số lượng thành công cho size ' . $productVariationValue->attributeValue->value . ' với số lượng là ' . $validatedData['stock']
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Cập nhật số lượng thất bại.',
                'error' => $e->getMessage(),
            ], 500);
        }
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




    // bộ lọc trang thái sp

    public function listProductsByDateAndSupplier(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $supplier = $request->input('supplier');
        $categoryId = $request->input('category_id');
        $slug = $request->input('slug');
        $products = Product::with(
            [
                'variations.attributeValue',
                'variations.group',
                'variations.variationValues',
                'variations.variationImages',
                'cost'
            ]
        )
            ->whereHas('cost', function ($query) use ($startDate, $endDate, $supplier, $categoryId, $slug) {
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

                if ($slug) {
                    $query->where('slug', 'LIKE', '%' . $slug . '%');
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


    // tồn

    // public function listInventoryDetails(Request $request)
    // {
    //     $products = Product::with(['cost', 'billDetails.bill'])->get();
    //     $result = $products->map(function ($product) {
    //         $importDate = optional($product->cost->first())->import_date;
    //         $saleStatus = optional($product->cost->first())->sale_status ?? 'unknown';
    //         $importPrice = optional($product->cost->first())->cost_price ?? 0;
    //         $supplier = optional($product->cost->first())->supplier ?? 'unknown';

    //         $totalImportedQuantity = $product->cost ? $product->cost->sum('quantity') : 0;
    //         $totalImportedAmount = $product->cost ? $product->cost->sum(function ($cost) {
    //             return $cost->quantity * $cost->cost_price;
    //         }) : 0;

    //         $successfulBillDetails = $product->billDetails->filter(function ($detail) {
    //             return optional($detail->bill)->status_bill === Bill::STATUS_DELIVERED;
    //         });

    //         $totalExportedQuantity = $successfulBillDetails->sum('quantity');
    //         $totalExportedAmount = $successfulBillDetails->sum(function ($detail) {
    //             return $detail->quantity * $detail->don_gia;
    //         });

    //         $exportPrice = $successfulBillDetails->isNotEmpty()
    //             ? $successfulBillDetails->first()->don_gia
    //             : 0;



    //         // Trả về dữ liệu đã xử lý
    //         return [
    //             'id' => $product->id, // Tên sản phẩm
    //             'product_name' => $product->name, // Tên sản phẩm
    //             'slug' => $product->slug, // Slug sản phẩm
    //             'import_date' => $importDate, // Ngày nhập lần đầu
    //             'status' => $saleStatus, // Trạng thái bán
    //             'supplier' => $supplier, // Nhà cung cấp
    //             'cost_price' => $importPrice, // Giá nhập lần đầu
    //             'total_imported_quantity' => $totalImportedQuantity, // Tổng số lượng nhập
    //             'total_imported_amount' => $totalImportedAmount, // Tổng thành tiền nhập

    //             'export_price' => $exportPrice, // Giá xuất
    //             'total_exported_quantity' => $totalExportedQuantity, // Tổng số lượng xuất
    //             'total_exported_amount' => $totalExportedAmount, // Tổng thành tiền xuất

    //             'remaining_price' => $importPrice, 
    //             'remaining_quantity' => $totalImportedQuantity-$totalExportedQuantity, // Số lượng tồn
    //             'remaining_amount' => ($totalImportedQuantity-$totalExportedQuantity)*$importPrice, // Thành tiền tồn
    //         ];
    //     });

    //     // Trả về kết quả dưới dạng JSON
    //     return response()->json($result);
    // }

    public function listInventoryDetails(Request $request)
    {
        $slug = $request->input('slug');
        $supplier = $request->input('supplier');
    
        $query = Product::with(['cost', 'billDetails.bill'])
        ->orderBy('id','desc');
    
        if ($slug) {
            $query->where('slug', $slug);
        }
    
        if ($supplier) {
            $query->whereHas('cost', function ($q) use ($supplier) {
                $q->where('supplier', $supplier);
            });
        }
    
        $products = $query->get();
    
        $result = $products->map(function ($product) {
            $importDate = optional($product->cost->first())->import_date;
            $importPrice = optional($product->cost->first())->cost_price ?? 0;
            $supplier = optional($product->cost->first())->supplier ?? 'unknown';
    
            $totalImportedQuantity = $product->cost ? $product->cost->sum('quantity') : 0;
            $totalImportedAmount = $product->cost ? $product->cost->sum(function ($cost) {
                return $cost->quantity * $cost->cost_price;
            }) : 0;
    
            $successfulBillDetails = $product->billDetails->filter(function ($detail) {
                return optional($detail->bill)->status_bill === Bill::STATUS_DELIVERED;
            });
    
            $totalExportedQuantity = $successfulBillDetails->sum('quantity');
            $totalExportedAmount = $successfulBillDetails->sum(function ($detail) {
                return $detail->quantity * $detail->don_gia;
            });
    
            $exportPrice = $successfulBillDetails->isNotEmpty()
                ? $successfulBillDetails->first()->don_gia
                : 0;
    
            return [
                'id' => $product->id,
                'product_name' => $product->name,
                'slug' => $product->slug,
                'import_date' => $importDate,
                'supplier' => $supplier,
                'cost_price' => $importPrice,
                'total_imported_quantity' => $totalImportedQuantity,
                'total_imported_amount' => $totalImportedAmount,
                'export_price' => $exportPrice,
                'total_exported_quantity' => $totalExportedQuantity,
                'total_exported_amount' => $totalExportedAmount,
                'remaining_price' => $importPrice,
                'remaining_quantity' => $totalImportedQuantity - $totalExportedQuantity,
                'remaining_amount' => ($totalImportedQuantity - $totalExportedQuantity) * $importPrice,
            ];
        });
    
        // Trả về kết quả JSON
        return response()->json($result);
    }
    
    


// chi tiết kho

public function getProductInventoryDetails($id)
{
    $product = Product::with([
        'cost', 
        'variations.variationValues.attributeValue',
    ])->findOrFail($id);


    $productDetails = [
        'product_name' => $product->name,
        'slug' => $product->slug,
        'total_stock' => $product->stock,
        'cost_price' => optional($product->cost->first())->cost_price, 
        'supplier' => optional($product->cost->first())->supplier, 
    ];

    // Tổ chức dữ liệu nhập kho
    $importDetails = $product->cost->groupBy(function ($cost) {
        return $cost->created_at->format('Y-m-d H:i:s'); 
    })->map(function ($group, $key) {
        $first = $group->first();
        return [
            'import_date' => $first->created_at->format('Y-m-d'), 
            'import_time' => $first->created_at->format('H:i:s'), 
            'detail' => $group->map(function ($cost) {
                $variationValue = ProductVariationValue::find($cost->product_variation_value_id);

                if ($variationValue) {
                    return [
                        'product_variation_value_id' => $cost->product_variation_value_id,
                        'color' => optional($variationValue->productVariation->attributeValue)->value ?? 'Unknown',
                        'size' => $variationValue->attributeValue->value ?? 'Unknown',
                        'quantity' => $cost->quantity,
                    ];
                }

                return [
                    'product_variation_value_id' => $cost->product_variation_value_id,
                    'color' => 'Unknown',
                    'size' => 'Unknown',
                    'quantity' => $cost->quantity,
                ];
            })->values(), 
        ];
    })->values(); 


    return response()->json([
        'product_name' => $productDetails['product_name'],
        'slug' => $productDetails['slug'],
        'total_stock' => $productDetails['total_stock'],
        'cost_price' => $productDetails['cost_price'],
        'supplier' => $productDetails['supplier'],
        'import_details' => $importDetails,
    ]);
}

    
    
    
    
}
