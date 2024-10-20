<?php
namespace App\Http\Controllers\Api\Client\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Bill;
use App\Models\BillDentail;
use App\Models\Product;
use App\Models\ProductVariationValue;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    public function showDetail($id)
    {
        try {
            // Lấy sản phẩm theo ID
            $product = Product::with([
                'variations.attributeValue',
                'variations.group',
                'variations.variationValues',
                'variations.variationImages',
                'images'
            ])->findOrFail($id);

            $relatedProductsSameCategory = Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id) 
                ->take(5)
                ->get();

            $relatedProductsDifferentCategory = Product::where('category_id', '!=', $product->category_id)
                ->take(15)
                ->get();

            // Trả về kết quả
            return response()->json([
                'product' => new ProductResource($product),
                'related_products_same_category' => ProductResource::collection($relatedProductsSameCategory),
                'related_products_different_category' => ProductResource::collection($relatedProductsDifferentCategory)
            ]);
            
        } catch (ModelNotFoundException $e) {
            // Xử lý khi không tìm thấy sản phẩm
            return response()->json([
                'message' => 'Sản phẩm không tồn tại'
            ], 404);
        }
    }



public function purchase(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'email_receiver' => 'required|email',
        'phone_receiver' => 'required|string',
        'note' => 'nullable|string',
        'payment_type' => 'required|in:' . Bill::PAYMENT_TYPE_ONLINE . ',' . Bill::PAYMENT_TYPE_COD,
        'shipping_address_id' => 'required|exists:shipping_addresses,id',
        'promotion_id' => 'nullable|exists:promotions,id',
        'variations' => 'required|array|min:1',  
        'variations.*.product_variation_value_id' => 'required|exists:product_variation_values,id',
        'variations.*.quantity' => 'required|integer|min:1',
    ]);

    DB::beginTransaction();

    try {
        do {
            $codeOrders = 'ORDER-' . strtoupper(uniqid());
        } while (Bill::where('code_orders', $codeOrders)->exists());

        $bill = Bill::create([
            'user_id' => $request->user()->id,
            'code_orders' => $codeOrders,
            'email_receiver' => $validated['email_receiver'],
            'note' => $validated['note'],
            'status_bill' => Bill::STATUS_PENDING,
            'payment_type' => $validated['payment_type'],
            'subtotal' => 0,
            'total' => 0,
            'promotion_id' => $validated['promotion_id'] ?? null,
            'shipping_address_id' => $validated['shipping_address_id'],
            'canceled_at' => null,
        ]);

        $subtotal = 0;
        $totalQuantity = 0;  


        foreach ($validated['variations'] as $variation) {
            $variationValue = ProductVariationValue::findOrFail($variation['product_variation_value_id']);


            if ($variationValue->stock < $variation['quantity']) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Biến thể ' . $variationValue->id . ' không đủ số lượng trong kho'
                ], 400);
            }

            $totalAmount = $variationValue->price * $variation['quantity'];
            $subtotal += $totalAmount;

            BillDentail::create([
                'bill_id' => $bill->id,
                'product_id' => $validated['product_id'],
                'product_variation_value_id' => $variation['product_variation_value_id'],
                'don_gia' => $variationValue->price,
                'quantity' => $variation['quantity'],
                'total_amount' => $totalAmount,
            ]);


            $variationValue->decrement('stock', $variation['quantity']);

            $productVariation = $variationValue->productVariation;
            $productVariation->decrement('stock', $variation['quantity']);
            $totalQuantity += $variation['quantity'];
        }

        $product = Product::findOrFail($validated['product_id']);
        if ($product->stock < $totalQuantity) {
            DB::rollBack();
            return response()->json([
                'message' => 'Sản phẩm không đủ số lượng trong kho'
            ], 400);
        }
        $product->decrement('stock', $totalQuantity);

        $bill->update([
            'subtotal' => $subtotal,
            'total' => $subtotal,  
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Đặt hàng thành công',
            'bill' => $bill
        ], 201);

    } catch (ModelNotFoundException $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Không tìm thấy sản phẩm hoặc biến thể'
        ], 404);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Đã xảy ra lỗi trong quá trình đặt hàng',
            'error' => $e->getMessage()
        ], 500);
    }
}

    

}