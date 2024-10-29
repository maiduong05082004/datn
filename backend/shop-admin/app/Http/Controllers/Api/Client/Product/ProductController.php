<?php

namespace App\Http\Controllers\Api\Client\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\Product;
use App\Models\ProductVariationValue;
use App\Models\Promotion;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;

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
            '*.product_id' => 'required|exists:products,id',
            '*.email_receiver' => 'required|email',
            '*.note' => 'nullable|string',
            '*.payment_type' => 'required|in:' . Bill::PAYMENT_TYPE_ONLINE . ',' . Bill::PAYMENT_TYPE_COD,
            '*.shipping_address_id' => 'required|exists:shipping_addresses,id',
            '*.variations' => 'required|array|min:1',
            '*.variations.*.product_variation_value_id' => 'required|exists:product_variation_values,id',
            '*.variations.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Sinh mã đơn hàng duy nhất
            $codeOrders = $this->generateUniqueOrderCode();

            // Khởi tạo hóa đơn
            $bill = Bill::create([
                'user_id' => $request->user()->id,
                'code_orders' => $codeOrders,
                'email_receiver' => $validated[0]['email_receiver'],
                'note' => $validated[0]['note'],
                'status_bill' => Bill::STATUS_PENDING,
                'payment_type' => $validated[0]['payment_type'],
                'subtotal' => 0,
                'total' => 0,
                'shipping_address_id' => $validated[0]['shipping_address_id'],
                'canceled_at' => null,
            ]);

            $subtotal = 0;

            // Duyệt qua từng sản phẩm trong request
            foreach ($validated as $order) {
                $this->processOrderItems($order, $bill, $subtotal);
            }

            // Cập nhật tổng tiền và hoàn thành giao dịch
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

    private function generateUniqueOrderCode()
    {
        do {
            $codeOrders = 'ORDER-' . strtoupper(uniqid());
        } while (Bill::where('code_orders', $codeOrders)->exists());

        return $codeOrders;
    }

    private function processOrderItems($order, $bill, &$subtotal)
    {
        $totalQuantity = 0;

        foreach ($order['variations'] as $variation) {
            $variationValue = ProductVariationValue::findOrFail($variation['product_variation_value_id']);

            // Kiểm tra tồn kho
            if ($variationValue->stock < $variation['quantity']) {
                throw new \Exception("Biến thể {$variationValue->id} không đủ số lượng trong kho.");
            }

            // Tính tổng tiền của biến thể
            $totalAmount = $variationValue->price * $variation['quantity'];
            $subtotal += $totalAmount;

            BillDetail::create([
                'bill_id' => $bill->id,
                'product_id' => $order['product_id'],
                'product_variation_value_id' => $variation['product_variation_value_id'],
                'don_gia' => $variationValue->price,
                'quantity' => $variation['quantity'],
                'total_amount' => $totalAmount,
            ]);

            // Giảm tồn kho
            $variationValue->decrement('stock', $variation['quantity']);
            $variationValue->productVariation->decrement('stock', $variation['quantity']);

            $totalQuantity += $variation['quantity'];
        }

        // Giảm tồn kho sản phẩm chính
        $product = Product::findOrFail($order['product_id']);
        if ($product->stock < $totalQuantity) {
            throw new \Exception("Sản phẩm không đủ số lượng trong kho.");
        }

        $product->decrement('stock', $totalQuantity);
    }





    public function index(Request $request)
    {
        $user = Auth::user();
    
        $bills = Bill::with([
            'shippingAddress:id,address_line,city,district,ward,phone_number',
            'BillDetail.product:id,name,price',
            'BillDetail.productVariationValue:id,product_variation_id,attribute_value_id,sku,stock,price,discount',
            'BillDetail.productVariationValue.attributeValue:id,value',
            'BillDetail.productVariationValue.productVariation.variationImages' => function ($query) {
                $query->select('product_variation_id', 'image_path'); // Lấy ảnh của biến thể
            }
        ])
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->paginate(10);
    
        $bills->getCollection()->transform(function ($bill) {
            // Thêm mô tả trạng thái đơn hàng
            $bill->status_description = $bill->getTrangThaiDonHang();
            $bill->payment_type_description = $bill->getLoaiThanhToan();
    
            // Chuyển đổi created_at sang múi giờ Việt Nam và tách thành ngày và giờ
            $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
            $bill->order_date = $dateTime->format('d/m/Y'); // Chỉ ngày
            $bill->order_time = $dateTime->format('H:i:s'); // Chỉ giờ
    
            // Bỏ trường updated_at và created_at gốc
            unset($bill->updated_at);
            unset($bill->created_at);
    
            // Đưa các trường từ shippingAddress lên cấp trên
            if ($bill->shippingAddress) {
                $bill->shipping_address_id = $bill->shippingAddress->id;
                $bill->address_line = $bill->shippingAddress->address_line;
                $bill->city = $bill->shippingAddress->city;
                $bill->district = $bill->shippingAddress->district;
                $bill->ward = $bill->shippingAddress->ward;
                $bill->phone_number = $bill->shippingAddress->phone_number;
                unset($bill->shippingAddress); // Xóa shippingAddress để tránh lồng nhau
            }
    
            // Đưa thông tin từ product và productVariationValue lên cùng cấp trong mỗi BillDetail và sắp xếp lại các trường
            $bill->BillDetail->transform(function ($detail) {
                $detail->name = $detail->product->name ?? null;
                $detail->price = $detail->product->price ?? null;
                $detail->sku = $detail->productVariationValue->sku ?? null;
                $detail->discount = $detail->productVariationValue->discount ?? null;
                $detail->attribute_value = $detail->productVariationValue->attributeValue->value ?? null;
                $detail->attribute_value_name = $detail->productVariationValue->ProductVariation->attributeValue->value ?? null;
    
                // Lấy hình ảnh từ ProductVariation nếu có
                $detail->variation_images = $detail->productVariationValue->productVariation->variationImages->pluck('image_path') ?? [];
    
                // Xóa các thuộc tính không cần thiết
                unset($detail->product);
                unset($detail->productVariationValue);
                unset($detail->created_at);
                unset($detail->updated_at);
    
                // Re-order the fields
                return [
                    'id' => $detail->id,
                    'bill_id' => $detail->bill_id,
                    'product_id' => $detail->product_id,
                    'name' => $detail->name,
                    'price' => $detail->price,
                    'attribute_value_color' => $detail->attribute_value_name,
                    'attribute_value_size' => $detail->attribute_value,
                    'variation_value_size_id' => $detail->product_variation_value_id,
                    'discount' => $detail->discount,                 
                    'sku' => $detail->sku,
                    'don_gia' => $detail->don_gia,
                    'quantity' => $detail->quantity,
                    'total_amount' => $detail->total_amount,
                    'variation_images' => $detail->variation_images,
                ];
            });
    
            // Re-order the fields for bill
            return [
                'id' => $bill->id,
                'code_orders' => $bill->code_orders,
                'user_id' => $bill->user_id,
                'email_receiver' => $bill->email_receiver,
                'note' => $bill->note,
                'payment_type' => $bill->payment_type,
                'payment_type_description' => $bill->payment_type_description,
                'status_bill' => $bill->status_bill,
                'status_description' => $bill->status_description,
                'order_date' => $bill->order_date,
                'order_time' => $bill->order_time,
                'canceled_at' => $bill->canceled_at,
                'subtotal' => $bill->subtotal,
                'total' => $bill->total,
                'shipping_address_id' => $bill->shipping_address_id,
                'address_line' => $bill->address_line,
                'city' => $bill->city,
                'district' => $bill->district,
                'ward' => $bill->ward,
                'phone_number' => $bill->phone_number,
                'bill_detail' => $bill->BillDetail,
            ];
        });
    
        // Trả về dữ liệu với thông tin người dùng ở ngoài cùng
        return response()->json([
            'user_id' => $user->id,
            'name' => $user->name,
            'bills' => $bills->items(),
            'pagination' => [
                'current_page' => $bills->currentPage(),
                'last_page' => $bills->lastPage(),
                'per_page' => $bills->perPage(),
                'total' => $bills->total(),
            ]
        ], 200);
    }
    
    
}
