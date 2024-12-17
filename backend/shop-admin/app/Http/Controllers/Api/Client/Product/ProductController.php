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
use App\Mail\OrderConfirmationMail;
use App\Models\Payment;
use App\Models\UserPromotion;
use Illuminate\Support\Facades\Mail;

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
        $validatedData = $request->validate([
            'total' => 'required|numeric|min:0',
            'promotion_ids' => 'nullable|array',
            'promotion_ids.*' => 'integer|exists:promotions,id',
            'note' => 'nullable|string',
            'payment_type' => 'required|in:' . Bill::PAYMENT_TYPE_ONLINE . ',' . Bill::PAYMENT_TYPE_COD,
            'cart_id' => 'required|array',
            'cart_id.*' => 'integer|exists:cart_items,id',
            'shipping_fee' => 'nullable|numeric|min:0',
            'discounted_amount' => 'nullable|numeric|min:0',
            'discounted_shipping_fee' => 'nullable|numeric|min:0',

        ]);


        // Kiểm tra xem user đã dùng promotion nào trong danh sách chưa
        if ($request->has('promotion_ids') && is_array($request->promotion_ids)) {
            $usedPromotions = UserPromotion::where('user_id', Auth::id())
                ->whereIn('promotion_id', $request->promotion_ids)
                ->pluck('promotion_id')
                ->toArray();

            if (!empty($usedPromotions)) {
                return response()->json([
                    'error' => 'Bạn đã sử dụng các mã khuyến mãi này rồi. Vui lòng sử dụng mã khuyến mãi khác.'
                ], 400);
            }
        }

        // Kiểm tra và lấy địa chỉ giao hàng mặc định nếu không có `shipping_address_id`
        $validatedData['shipping_address_id'] = $this->getShippingAddressId($request, $validatedData);

        if (!$validatedData['shipping_address_id']) {
            return response()->json(['message' => 'Vui lòng chọn địa chỉ mặc định cho đơn hàng của bạn.'], 400);
        }

        DB::beginTransaction();

        try {
            $bill = $this->createBill($request, $validatedData);

            $subtotal = 0;
            $orderItems = $this->processCartItems($validatedData['cart_id'], $bill, $subtotal);

            // Cập nhật subtotal và lưu vào hóa đơn
            $bill->update(['subtotal' => $subtotal]);

            DB::commit();

            // Xóa các cart_items đã thanh toán thành công
            CartItem::whereIn('id', $validatedData['cart_id'])->delete();

            // Gửi email xác nhận đơn hàng qua hàng đợi
            $orderData = $this->prepareOrderData($request, $bill, $orderItems);
            Mail::to($request->user()->email)->queue(new OrderConfirmationMail($orderData));

            if ($request->has('promotion_ids') && is_array($request->promotion_ids)) {
                foreach ($request->promotion_ids as $promotionId) {
                    UserPromotion::create([
                        'user_id' => $bill->user_id,
                        'promotion_id' => $promotionId,
                    ]);
                }
            }
            // Giảm số lượng voucher còn lại trong bảng Promotions
            $promotion = Promotion::find($promotionId);
            if ($promotion && $promotion->usage_limit > 0) {
                $promotion->decrement('usage_limit');
            }
            return response()->json(['message' => 'Đặt hàng thành công và email xác nhận sẽ được gửi!', 'bill' => $bill], 201);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Không tìm thấy sản phẩm hoặc biến thể'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình đặt hàng', 'error' => $e->getMessage()], 500);
        }
    }

    // Helper methods
    private function getShippingAddressId($request, &$validatedData)
    {
        if (!isset($request->shipping_address_id)) {
            $defaultAddress = DB::table('shipping_addresses')
                ->where('user_id', $request->user()->id)
                ->where('is_default', 1)
                ->first();
            return $defaultAddress ? $defaultAddress->id : null;
        } else {
            return DB::table('shipping_addresses')
                ->where('id', $request->shipping_address_id)
                ->where('user_id', $request->user()->id)
                ->exists() ? $request->shipping_address_id : null;
        }
    }

    private function createBill($request, $validatedData)
    {
        $codeOrders = $this->generateUniqueOrderCode();
        $shippingFee = $validatedData['shipping_fee'] ?? 0;
        $discountedAmount = $validatedData['discounted_amount'] ?? 0;
        $discountedShippingFee = $validatedData['discounted_shipping_fee'] ?? 0;
        return Bill::create([
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
            'shipping_fee' => $shippingFee,
            'discounted_amount' => $discountedAmount,
            'discounted_shipping_fee' => $discountedShippingFee,

        ]);
    }

    private function processCartItems($cartIds, $bill, &$subtotal)
    {
        $orderItems = [];
        $cartItems = CartItem::whereIn('id', $cartIds)->get();

        foreach ($cartItems as $cartItem) {
            $variationValue = ProductVariationValue::findOrFail($cartItem->product_variation_value_id);
            $totalAmount = $variationValue->price * $cartItem->quantity;
            $subtotal += $totalAmount;

            BillDetail::create([
                'bill_id' => $bill->id,
                'product_id' => $cartItem->product_id,
                'product_variation_value_id' => $cartItem->product_variation_value_id,
                'don_gia' => $variationValue->price,
                'quantity' => $cartItem->quantity,
                'total_amount' => $totalAmount,
            ]);

            $variationValue->decrement('stock', $cartItem->quantity);
            $variationValue->productVariation->decrement('stock', $cartItem->quantity);
            Product::findOrFail($cartItem->product_id)->decrement('stock', $cartItem->quantity);

            $orderItems[] = [
                'productName' => $cartItem->product->name,
                'size' => $variationValue->attributeValue->value,
                'color' => $variationValue->productVariation->attributeValue->value,
                'quantity' => $cartItem->quantity,
                'unitPrice' => $variationValue->price,
                'total' => $totalAmount,
                'image' => $cartItem->productVariationValue->productVariation->variationImages()
                    ->where('image_type', 'album')
                    ->first()?->image_path,
            ];
        }

        return $orderItems;
    }

    private function prepareOrderData($request, $bill, $orderItems)
    {
        return [
            'customerName' => $bill->shippingAddress->full_name,
            'orderId' => $bill->code_orders,
            'orderDate' => now()->format('d/m/Y H:i'),
            'paymentType' => $bill->getLoaiThanhToan(),
            'shippingAddress' => $bill->shippingAddress->address_line,
            'phoneNumber' => $bill->shippingAddress->phone_number,
            'orderItems' => $orderItems,
            'subtotal' => $bill->subtotal,
            'shipping_fee' => $bill->shipping_fee,
            'discounted_amount' => $bill->discounted_amount,
            'discounted_shipping_fee' => $bill->discounted_shipping_fee,
            'totalAmount' => (int) ($bill->total + ($bill->shipping_fee ?? 0) - ($bill->discounted_amount ?? 0) - ($bill->discounted_shipping_fee ?? 0)),
        ];
    }



    private function generateUniqueOrderCode()
    {
        do {
            $codeOrders = 'ORDER-' . strtoupper(uniqid());
        } while (Bill::where('code_orders', $codeOrders)->exists());

        return $codeOrders;
    }






    // public function index(Request $request)
    // {
    //     $user = Auth::user();

    //     $bills = Bill::with([
    //         'shippingAddress:id,address_line,city,district,ward,phone_number',
    //         'BillDetail.product:id,name,price',
    //         'BillDetail.productVariationValue:id,product_variation_id,attribute_value_id,sku,stock,price,discount',
    //         'BillDetail.productVariationValue.attributeValue:id,value',
    //         'BillDetail.productVariationValue.productVariation.variationImages' => function ($query) {
    //             $query->select('product_variation_id', 'image_path'); // Lấy ảnh của biến thể
    //         }
    //     ])
    //         ->where('user_id', $user->id)
    //         ->orderBy('created_at', 'desc')
    //         ->paginate(10);

    //     $bills->getCollection()->transform(function ($bill) {
    //         // Thêm mô tả trạng thái đơn hàng
    //         $bill->status_description = $bill->getTrangThaiDonHang();
    //         $bill->payment_type_description = $bill->getLoaiThanhToan();

    //         // Chuyển đổi created_at sang múi giờ Việt Nam và tách thành ngày và giờ
    //         $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
    //         $bill->order_date = $dateTime->format('d/m/Y'); // Chỉ ngày
    //         $bill->order_time = $dateTime->format('H:i:s'); // Chỉ giờ

    //         // Bỏ trường updated_at và created_at gốc
    //         unset($bill->updated_at);
    //         unset($bill->created_at);

    //         // Đưa các trường từ shippingAddress lên cấp trên
    //         if ($bill->shippingAddress) {
    //             $bill->shipping_address_id = $bill->shippingAddress->id;
    //             $bill->address_line = $bill->shippingAddress->address_line;
    //             $bill->city = $bill->shippingAddress->city;
    //             $bill->district = $bill->shippingAddress->district;
    //             $bill->ward = $bill->shippingAddress->ward;
    //             $bill->phone_number = $bill->shippingAddress->phone_number;
    //             unset($bill->shippingAddress); // Xóa shippingAddress để tránh lồng nhau
    //         }

    //         // Lấy thông tin từ bảng promotions
    //         $promotionIds = explode(',', $bill->promotion_ids); // Tách chuỗi "1,2,3" thành mảng
    //         $promotions = Promotion::whereIn('id', $promotionIds)->get(['code', 'discount_amount', 'description']);

    //         // Thêm thông tin khuyến mãi vào kết quả trả về
    //         $bill->promotions = $promotions;

    //         // Đưa thông tin từ product và productVariationValue lên cùng cấp trong mỗi BillDetail và sắp xếp lại các trường
    //         $bill->BillDetail->transform(function ($detail) {
    //             $detail->name = $detail->product->name ?? null;
    //             $detail->price = $detail->product->price ?? null;
    //             $detail->sku = $detail->productVariationValue->sku ?? null;
    //             $detail->discount = $detail->productVariationValue->discount ?? null;
    //             $detail->attribute_value = $detail->productVariationValue->attributeValue->value ?? null;
    //             $detail->attribute_value_name = $detail->productVariationValue->ProductVariation->attributeValue->value ?? null;

    //             // Lấy hình ảnh từ ProductVariation nếu có
    //             $detail->variation_images = $detail->productVariationValue->productVariation->variationImages->pluck('image_path') ?? [];

    //             // Xóa các thuộc tính không cần thiết
    //             unset($detail->product);
    //             unset($detail->productVariationValue);
    //             unset($detail->created_at);
    //             unset($detail->updated_at);

    //             // Re-order the fields
    //             return [
    //                 'id' => $detail->id,
    //                 'bill_id' => $detail->bill_id,
    //                 'product_id' => $detail->product_id,
    //                 'name' => $detail->name,
    //                 'price' => $detail->price,
    //                 'attribute_value_color' => $detail->attribute_value_name,
    //                 'attribute_value_size' => $detail->attribute_value,
    //                 'variation_value_size_id' => $detail->product_variation_value_id,
    //                 'discount' => $detail->discount,
    //                 'sku' => $detail->sku,
    //                 'don_gia' => $detail->don_gia,
    //                 'quantity' => $detail->quantity,
    //                 'total_amount' => $detail->total_amount,
    //                 'variation_images' => $detail->variation_images,
    //             ];
    //         });

    //         // Re-order the fields for bill
    //         return [
    //             'id' => $bill->id,
    //             'code_orders' => $bill->code_orders,
    //             'user_id' => $bill->user_id,
    //             'email_receiver' => $bill->email_receiver,
    //             'note' => $bill->note,
    //             'payment_type' => $bill->payment_type,
    //             'payment_type_description' => $bill->payment_type_description,
    //             'status_bill' => $bill->status_bill,
    //             'status_description' => $bill->status_description,
    //             'order_date' => $bill->order_date,
    //             'order_time' => $bill->order_time,
    //             'canceled_at' => $bill->canceled_at,
    //             'subtotal' => $bill->subtotal,
    //             'promotions' => $bill->promotions,
    //             'total' => $bill->total,
    //             'shipping_address_id' => $bill->shipping_address_id,
    //             'address_line' => $bill->address_line,
    //             'city' => $bill->city,
    //             'district' => $bill->district,
    //             'ward' => $bill->ward,
    //             'phone_number' => $bill->phone_number,
    //             'bill_detail' => $bill->BillDetail,
    //             // Thêm thông tin khuyến mãi vào response
    //         ];
    //     });

    //     // Trả về dữ liệu với thông tin người dùng ở ngoài cùng
    //     return response()->json([
    //         'user_id' => $user->id,
    //         'name' => $user->name,
    //         'bills' => $bills->items(),
    //         'pagination' => [
    //             'current_page' => $bills->currentPage(),
    //             'last_page' => $bills->lastPage(),
    //             'per_page' => $bills->perPage(),
    //             'total' => $bills->total(),
    //         ]
    //     ], 200);
    // }

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
            },
            'payments'
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
            $bill->promotions = $promotions;

            // Đưa thông tin từ product và productVariationValue lên cùng cấp trong mỗi BillDetail và sắp xếp lại các trường
            $bill->BillDetail->transform(function ($detail) {
                $detail->name = $detail->product->name ?? null;
                $detail->price = $detail->product->price ?? null;
                $detail->sku = $detail->productVariationValue->sku ?? null;
                $detail->discount = $detail->productVariationValue->discount ?? null;
                $detail->attribute_value = $detail->productVariationValue->attributeValue->value ?? null;
                $detail->attribute_value_name = $detail->productVariationValue->ProductVariation->attributeValue->value ?? null;
                $detail->variation_images = $detail->productVariationValue->productVariation->variationImages->pluck('image_path') ?? [];

                // Xóa các thuộc tính không cần thiết
                unset($detail->product);
                unset($detail->productVariationValue);
                unset($detail->created_at);
                unset($detail->updated_at);

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
                    'status_comment' => $detail->status_comment,
                    'variation_images' => $detail->variation_images,
                ];
            });
            $paymentInfo = $bill->payments->map(function ($payment) {
                $payDateTime = Carbon::parse($payment->pay_date)->timezone('Asia/Ho_Chi_Minh');

                return [
                    'id' => $payment->id,
                    'method' => $payment->payment_method,
                    'status' => $payment->status,
                    'amount' => $payment->amount,
                    'transaction_id' => $payment->transaction_id,
                    'bank_code' => $payment->bank_code,
                    'pay_date' => $payDateTime->format('d/m/Y'), // Ngày theo định dạng Việt Nam
                    'pay_time' => $payDateTime->format('H:i:s'), // Giờ theo định dạng Việt Nam
                    'currency_code' => $payment->currency_code,
                    'payer_email' => $payment->payer_email,
                    'transaction_fee' => $payment->transaction_fee,
                    'receipt_code' => $payment->receipt_code,
                ];
            })->first();

            // Re-order the fields for bill
            return [
                'id' => $bill->id,
                'code_orders' => $bill->code_orders,
                'user_id' => $bill->user_id,
                'email_receiver' => $bill->email_receiver,
                'note' => $bill->note,
                'payment_type' => $bill->payment_type,
                'payment_type_description' => $bill->payment_type_description,
                'payment_info' => $paymentInfo, // Thêm thông tin thanh toán
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

            ];
        });

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

            $bill = Bill::with([
                'shippingAddress:id,full_name,address_line,city,district,ward,phone_number',
                'BillDetail.product:id,name,price',
                'BillDetail.productVariationValue:id,product_variation_id,attribute_value_id,sku,stock,price,discount',
                'BillDetail.productVariationValue.attributeValue:id,value',
                'BillDetail.productVariationValue.productVariation.variationImages' => function ($query) {
                    $query->select('product_variation_id', 'image_path');
                },
                'payments'

            ])->findOrFail($orderId);


            $bill->status_description = $bill->getTrangThaiDonHang();
            $bill->payment_type_description = $bill->getLoaiThanhToan();


            $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
            $bill->order_date = $dateTime->format('d/m/Y');
            $bill->order_time = $dateTime->format('H:i:s');

            if ($bill->shippingAddress) {
                $bill->shipping_address_id = $bill->shippingAddress->id;
                $bill->full_name = $bill->shippingAddress->full_name;
                $bill->address_line = $bill->shippingAddress->address_line;
                $bill->city = $bill->shippingAddress->city;
                $bill->district = $bill->shippingAddress->district;
                $bill->ward = $bill->shippingAddress->ward;
                $bill->phone_number = $bill->shippingAddress->phone_number;
                unset($bill->shippingAddress); // Xóa shippingAddress để tránh lồng nhau
            }

            $promotionIds = explode(',', $bill->promotion_ids); // Tách chuỗi "1,2,3" thành mảng
            $promotions = Promotion::whereIn('id', $promotionIds)->get(['code', 'discount_amount', 'description']);

            // Thêm thông tin khuyến mãi vào kết quả trả về
            $bill->promotions = $promotions;
            $bill->BillDetail->transform(function ($detail) {
                $detail->name = $detail->product->name ?? null;
                $detail->price = $detail->product->price ?? null;
                $detail->sku = $detail->productVariationValue->sku ?? null;
                $detail->discount = $detail->productVariationValue->discount ?? null;
                $detail->attribute_value = $detail->productVariationValue->attributeValue->value ?? null;
                $detail->attribute_value_name = $detail->productVariationValue->productVariation->attributeValue->value ?? null;


                $detail->variation_images = $detail->productVariationValue->productVariation->variationImages->pluck('image_path') ?? [];


                unset($detail->product);
                unset($detail->productVariationValue);
                unset($detail->created_at);
                unset($detail->updated_at);




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

            $paymentInfo = $bill->payments->map(function ($payment) {
                $payDateTime = Carbon::parse($payment->pay_date)->timezone('Asia/Ho_Chi_Minh');

                return [
                    'id' => $payment->id,
                    'method' => $payment->payment_method,
                    'status' => $payment->getPaymentStatus(),
                    'amount' => $payment->amount,
                    'transaction_id' => $payment->transaction_id,
                    'bank_code' => $payment->bank_code,
                    'pay_date' => $payDateTime->format('d/m/Y'), // Ngày theo định dạng Việt Nam
                    'pay_time' => $payDateTime->format('H:i:s'), // Giờ theo định dạng Việt Nam
                    'currency_code' => $payment->currency_code,
                    'payer_email' => $payment->payer_email,
                    'transaction_fee' => $payment->transaction_fee,
                    'receipt_code' => $payment->receipt_code,
                ];
            })->first();

            $canceledReasonTime = $bill->canceled_at ? Carbon::parse($bill->canceled_at)->timezone('Asia/Ho_Chi_Minh') : null;


            return response()->json([
                'id' => $bill->id,
                'code_orders' => $bill->code_orders,
                'user_id' => $bill->user_id,
                'email_receiver' => $bill->email_receiver,
                'note' => $bill->note,
                'canceled_reason' => $bill->canceled_reason ?? null,
                'canceled_date' => $canceledReasonTime ? $canceledReasonTime->format('d/m/Y') : null,
                'canceled_time' => $canceledReasonTime ? $canceledReasonTime->format('H:i:s') : null,
                'payment_type' => $bill->payment_type,
                'payment_type_description' => $bill->payment_type_description,
                'status_bill' => $bill->status_bill,
                'status_description' => $bill->status_description,
                'payment_info' => $paymentInfo,
                'order_date' => $bill->order_date,
                'order_time' => $bill->order_time,
                'canceled_at' => $bill->canceled_at,
                'subtotal' => $bill->subtotal,
                'promotions' => $bill->promotions,
                'discounted_amount' => $bill->discounted_amount ?? 0,
                'discounted_shipping_fee' => $bill->discounted_shipping_fee ?? 0,
                'shipping_fee' => $bill->shipping_fee ?? 0,
                'total' => (int) ($bill->total + ($bill->shipping_fee ?? 0) - ($bill->discounted_amount ?? 0) - ($bill->discounted_shipping_fee ?? 0)),
                'shipping_address_id' => $bill->shipping_address_id,
                'full_name' => $bill->full_name,
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



    public function cancelOrder(Request $request, $orderId)
    {
        $validatedData = $request->validate([
            'reason' => 'required|string|max:255', // Thêm lý do hủy
        ]);

        try {
            $bill = Bill::with('BillDetail.productVariationValue.productVariation.product', 'payments')
                ->findOrFail($orderId);

            // Kiểm tra trạng thái đơn hàng
            if (!$bill->isPending()) {
                return response()->json([
                    'message' => 'Đơn hàng không thể hủy trong trạng thái hiện tại.',
                    'current_status' => $bill->status_bill,
                ], 400);
            }

            // Kiểm tra nếu đơn hàng đã thanh toán
            if ($bill->payments->contains('status', Payment::STATUS_PAID)) {
                return response()->json(['message' => 'Không thể hủy đơn hàng đã được thanh toán.'], 400);
            }

            DB::beginTransaction();

            // Hoàn lại kho hàng
            foreach ($bill->BillDetail as $billDetail) {
                if ($billDetail->productVariationValue) {
                    $variationValue = $billDetail->productVariationValue;

                    $variationValue->increment('stock', $billDetail->quantity);
                    $variationValue->productVariation->increment('stock', $billDetail->quantity);
                    $variationValue->productVariation->product->increment('stock', $billDetail->quantity);
                }
            }

            // Cập nhật trạng thái đơn hàng và lưu lý do hủy
            $bill->update([
                'status_bill' => Bill::STATUS_CANCELED,
                'canceled_at' => now(),
                'canceled_reason' => $validatedData['reason'], // Lưu lý do hủy
            ]);

            DB::commit();
            return response()->json(['message' => 'Đơn hàng đã được hủy thành công'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Cancel Order Error', ['error' => $e->getMessage(), 'orderId' => $orderId]);
            return response()->json(['message' => 'Đã xảy ra lỗi khi hủy đơn hàng.', 'error' => $e->getMessage()], 500);
        }
    }




    public function confirmOrder(Request $request, $orderId)
    {
        try {
            $bill = Bill::findOrFail($orderId);

            // Kiểm tra nếu trạng thái đơn hàng là "shipped"
            if (!$bill->isShipped()) {
                return response()->json(['message' => 'Chỉ có thể xác nhận đơn hàng khi đơn hàng đang được vận chuyển giao.'], 400);
            }


            $bill->update([
                'status_bill' => Bill::STATUS_DELIVERED,
                'canceled_at' => now(),

            ]);

            return response()->json(['message' => 'Đơn hàng đã được xác nhận thành công!'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi khi xác nhận đơn hàng', 'error' => $e->getMessage()], 500);
        }
    }


    public function relatedProducts()
    {
        $product = Product::inRandomOrder()
            ->take(12)
            ->get();
        return response()->json(
            [
                'data' =>  ProductResource::collection($product)
            ]
        );
    }
}
