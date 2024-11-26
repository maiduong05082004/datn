<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\TableProductCost;
use Illuminate\Http\Request;

class ProductCostController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id', // Kiểm tra product_id có tồn tại trong bảng products không
            'cost_price' => 'required|numeric',
            'supplier' => 'required|string|max:255',
            'import_date' => 'required|date',
        ]);
        $productId = $validated['product_id'];  // Lấy product_id từ body của request
        $product = Product::findOrFail($productId);
        // if (!$product) {
        //     return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        // }

        if ($validated['cost_price'] >= $product->price) {
            return response()->json([
                'message' => 'Giá nhập phải nhỏ hơn giá bán của sản phẩm.'
            ], 400);
        }
        $productCost = new TableProductCost();
        $productCost->product_id = $product->id;
        $productCost->cost_price = $validated['cost_price'];
        $productCost->supplier = $validated['supplier'];
        $productCost->import_date = $validated['import_date'];
        $productCost->save();

        // Trả về dữ liệu JSON
        return response()->json([
            'message' => 'Giá nhập đã được thêm thành công!',
            'data' => $productCost
        ], 201);
    }
}
