<?php

namespace App\Http\Controllers\Api\Client\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
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




    // public function purchase(Request $request)
    // {
    //     // Xác thực dữ liệu đầu vào
    //     $validatedData = $request->validate([
    //         'total' => 'required|numeric|min:0',
    //         'promotion_ids' => 'nullable|array',
    //         'promotion_ids.*' => 'integer|exists:promotions,id',
    //         'note' => 'nullable|string',
    //         'payment_type' => 'required|in:' . Bill::PAYMENT_TYPE_ONLINE . ',' . Bill::PAYMENT_TYPE_COD,
    //         'shipping_address_id' => 'required|exists:shipping_addresses,id',
    //         'cart_id' => 'required|array',
    //         'cart_id.*' => 'integer|exists:cart_items,id',
    //     ]);
    
    //     DB::beginTransaction();
    
    //     try {
    //         // Tạo mã đơn hàng duy nhất
    //         $codeOrders = $this->generateUniqueOrderCode();
    
    //         // Tạo hóa đơn
    //         $bill = Bill::create([
    //             'user_id' => $request->user()->id,
    //             'code_orders' => $codeOrders,
    //             'email_receiver' => $request->user()->email,
    //             'note' => $validatedData['note'],
    //             'status_bill' => Bill::STATUS_PENDING,
    //             'payment_type' => $validatedData['payment_type'],
    //             'subtotal' => 0,
    //             'total' => $validatedData['total'],
    //             'shipping_address_id' => $validatedData['shipping_address_id'],
    //             'promotion_ids' => implode(',', $validatedData['promotion_ids'] ?? []),
    //             'canceled_at' => null,
    //         ]);
    
    //         $subtotal = 0;
    
    //         // Lấy danh sách cart_items dựa trên IDs
    //         $cartItems = CartItem::whereIn('id', $validatedData['cart_id'])->get();
    
    //         foreach ($cartItems as $cartItem) {
    //             // Đảm bảo sản phẩm và biến thể tồn tại và có đủ tồn kho
    //             $this->processCartItem($cartItem, $bill, $subtotal);
    //         }
    
    //         // Cập nhật subtotal trong hóa đơn
    //         $bill->update(['subtotal' => $subtotal]);
    
    //         DB::commit();
    
    //         // Xóa các cart_items đã thanh toán thành công
    //         CartItem::whereIn('id', $validatedData['cart_id'])->delete();
    
    //         return response()->json([
    //             'message' => 'Đặt hàng thành công',
    //             'bill' => $bill
    //         ], 201);
    //     } catch (ModelNotFoundException $e) {
    //         DB::rollBack();
    //         return response()->json(['message' => 'Không tìm thấy sản phẩm hoặc biến thể'], 404);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình đặt hàng', 'error' => $e->getMessage()], 500);
    //     }
    // }
    


    public function purchase(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validatedData = $request->validate([
            'total' => 'required|numeric|min:0',
            'promotion_ids' => 'nullable|array',
            'promotion_ids.*' => 'integer|exists:promotions,id',
            'note' => 'nullable|string',
            'payment_type' => 'required|in:' . Bill::PAYMENT_TYPE_ONLINE . ',' . Bill::PAYMENT_TYPE_COD,
            'cart_id' => 'required|array',
            'cart_id.*' => 'integer|exists:cart_items,id',
        ]);
    
        // Kiểm tra nếu không có `shipping_address_id`, lấy địa chỉ mặc định
        if (!isset($request->shipping_address_id)) {
            $defaultAddress = DB::table('shipping_addresses')
                ->where('user_id', $request->user()->id)
                ->where('is_default', 1)
                ->first();
    
            if ($defaultAddress) {
                $validatedData['shipping_address_id'] = $defaultAddress->id;
            } else {
                return response()->json([
                    'message' => 'Vui lòng chọn địa chỉ mặc định cho đơn hàng của bạn.'
                ], 400);
            }
        } else {
            // Nếu `shipping_address_id` được gửi, kiểm tra địa chỉ có thuộc về người dùng không
            $addressExists = DB::table('shipping_addresses')
                ->where('id', $request->shipping_address_id)
                ->where('user_id', $request->user()->id)
                ->exists();
    
            if (!$addressExists) {
                return response()->json([
                    'message' => 'Địa chỉ giao hàng không hợp lệ.'
                ], 404);
            }
            $validatedData['shipping_address_id'] = $request->shipping_address_id;
        }
    
        DB::beginTransaction();
    
        try {
            // Tạo mã đơn hàng duy nhất
            $codeOrders = $this->generateUniqueOrderCode();
    
            // Tạo hóa đơn
            $bill = Bill::create([
                'user_id' => $request->user()->id,
                'code_orders' => $codeOrders,
                'email_receiver' => $request->user()->email,
                'note' => $validatedData['note'],
                'status_bill' => Bill::STATUS_PENDING,
                'payment_type' => $validatedData['payment_type'],
                'subtotal' => 0,
                'total' => $validatedData['total'],
                'shipping_address_id' => $validatedData['shipping_address_id'],
                'promotion_ids' => implode(',', $validatedData['promotion_ids'] ?? []),
                'canceled_at' => null,
            ]);
    
            $subtotal = 0;
    
            // Lấy danh sách cart_items dựa trên IDs
            $cartItems = CartItem::whereIn('id', $validatedData['cart_id'])->get();
    
            foreach ($cartItems as $cartItem) {
                // Đảm bảo sản phẩm và biến thể tồn tại và có đủ tồn kho
                $this->processCartItem($cartItem, $bill, $subtotal);
            }
    
            // Cập nhật subtotal trong hóa đơn
            $bill->update(['subtotal' => $subtotal]);
    
            DB::commit();
    
            // Xóa các cart_items đã thanh toán thành công
            CartItem::whereIn('id', $validatedData['cart_id'])->delete();
    
            return response()->json([
                'message' => 'Đặt hàng thành công',
                'bill' => $bill
            ], 201);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Không tìm thấy sản phẩm hoặc biến thể'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình đặt hàng', 'error' => $e->getMessage()], 500);
        }
    }
    

private function processCartItem($cartItem, $bill, &$subtotal)
{
    $variationValue = ProductVariationValue::findOrFail($cartItem->product_variation_value_id);

    if ($variationValue->stock < $cartItem->quantity) {
        throw new \Exception("Số lượng tồn kho không đủ cho biến thể ID {$variationValue->id}. Yêu cầu: {$cartItem->quantity}, Tồn kho: {$variationValue->stock}");
    }

    // Tính tổng tiền cho sản phẩm này
    $totalAmount = $variationValue->price * $cartItem->quantity;
    $subtotal += $totalAmount;

    // Thêm vào bill detail
    BillDetail::create([
        'bill_id' => $bill->id,
        'product_id' => $cartItem->product_id,
        'product_variation_value_id' => $cartItem->product_variation_value_id,
        'don_gia' => $variationValue->price,
        'quantity' => $cartItem->quantity,
        'total_amount' => $totalAmount,
    ]);

    // Trừ tồn kho
    $variationValue->decrement('stock', $cartItem->quantity);
    $variationValue->productVariation->decrement('stock', $cartItem->quantity);

    // Trừ tồn kho cho sản phẩm chính
    $product = Product::findOrFail($cartItem->product_id);
    $product->decrement('stock', $cartItem->quantity);
}







    private function generateUniqueOrderCode()
    {
        do {
            $codeOrders = 'ORDER-' . strtoupper(uniqid());
        } while (Bill::where('code_orders', $codeOrders)->exists());

        return $codeOrders;
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

            // Lấy thông tin từ bảng promotions
            $promotionIds = explode(',', $bill->promotion_ids); // Tách chuỗi "1,2,3" thành mảng
            $promotions = Promotion::whereIn('id', $promotionIds)->get(['code', 'discount_amount', 'description']);

            // Thêm thông tin khuyến mãi vào kết quả trả về
            $bill->promotions = $promotions;

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
                'promotions' => $bill->promotions,
                'total' => $bill->total,
                'shipping_address_id' => $bill->shipping_address_id,
                'address_line' => $bill->address_line,
                'city' => $bill->city,
                'district' => $bill->district,
                'ward' => $bill->ward,
                'phone_number' => $bill->phone_number,
                'bill_detail' => $bill->BillDetail,
                // Thêm thông tin khuyến mãi vào response
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



    public function showDetailOrder($orderId)
    {
        try {
            // Lấy thông tin đơn hàng với các liên kết chi tiết
            $bill = Bill::with([
                'shippingAddress:id,address_line,city,district,ward,phone_number',
                'BillDetail.product:id,name,price',
                'BillDetail.productVariationValue:id,product_variation_id,attribute_value_id,sku,stock,price,discount',
                'BillDetail.productVariationValue.attributeValue:id,value',
                'BillDetail.productVariationValue.productVariation.variationImages' => function ($query) {
                    $query->select('product_variation_id', 'image_path'); // Lấy ảnh của biến thể
                }
            ])->findOrFail($orderId);

            // Xử lý dữ liệu đơn hàng để hiển thị chi tiết hơn
            $bill->status_description = $bill->getTrangThaiDonHang();
            $bill->payment_type_description = $bill->getLoaiThanhToan();

            // Chuyển đổi created_at sang múi giờ Việt Nam và tách thành ngày và giờ
            $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
            $bill->order_date = $dateTime->format('d/m/Y'); // Chỉ ngày
            $bill->order_time = $dateTime->format('H:i:s'); // Chỉ giờ

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
                $detail->attribute_value_name = $detail->productVariationValue->productVariation->attributeValue->value ?? null;

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
            return response()->json([
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
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi lấy chi tiết đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
