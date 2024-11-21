<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\ProductVariationValue;
use App\Models\UserPromotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use App\Services\ExchangeRateService;
use DB;
use Illuminate\Support\Facades\Mail;

class CheckoutController extends Controller
{
    protected $exchangeRateService;

    public function __construct(ExchangeRateService $exchangeRateService)
    {
        $this->exchangeRateService = $exchangeRateService;
    }
    private function generateUniqueOrderCode()
    {
        do {
            $codeOrders = 'ORDER-' . strtoupper(uniqid());
        } while (Bill::where('code_orders', $codeOrders)->exists());

        return $codeOrders;
    }
    public function submit(Request $request)
    {
        // Kiểm tra xem user đã dùng promotion nào trong danh sách chưa
        if ($request->has('promotion_ids') && is_array($request->promotion_ids)) {
            $usedPromotions = UserPromotion::where('user_id', Auth::id())
                ->whereIn('promotion_id', $request->promotion_ids)
                ->pluck('promotion_id')
                ->toArray();

            if (!empty($usedPromotions)) {
                return response()->json([
                    'error' => 'Bạn đã sử dụng các mã khuyến mãi này rồi vui lòng sử dụng mã khuyến mãi khác'
                ], 400);
            }
        }

        $validator = Validator::make($request->all(), [
            'total' => 'required|numeric|min:0',
            'promotion_ids' => 'nullable|array',
            'note' => 'nullable|string|max:255',
            'payment_type' => 'required|string|in:online,cash',
            'payment_method' => 'required|string|in:paypal,vnpay',
            'shipping_address_id' => 'required|exists:shipping_addresses,id',
            'cart_id' => 'required|array',
            'cart_id.*' => 'integer|exists:cart_items,id',
            'shipping_fee' => 'required|numeric|min:0',
            'discounted_amount' => 'required|numeric|min:0',
            'discounted_shipping_fee' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tính toán subtotal và total
        $subtotal = $request->total - $request->discounted_amount;
        $total = $subtotal + $request->shipping_fee - $request->discounted_shipping_fee;

        // Tạo hóa đơn (bill)
        $bill = Bill::create([
            'user_id' => Auth::id(),
            'code_orders' => $this->generateUniqueOrderCode(),
            'email_receiver' => Auth::user()->email,
            'total' => $total,
            'subtotal' => $subtotal,
            'status_bill' => Bill::STATUS_PENDING,
            'shipping_fee' => $request->shipping_fee,
            'discounted_amount' => $request->discounted_amount,
            'discounted_shipping_fee' => $request->discounted_shipping_fee,
            'shipping_address_id' => $request->shipping_address_id,
            'promotion_ids' => json_encode($request->promotion_ids),
            'note' => $request->note,
            'payment_type' => $request->payment_type,
        ]);

        // Lấy danh sách cart_items
        $cartItems = CartItem::whereIn('id', $request->cart_id)->get();

        // Thêm các mục vào bill_details
        foreach ($cartItems as $item) {
            $variationValue = ProductVariationValue::findOrFail($item->product_variation_value_id);

            // Kiểm tra tồn kho
            if ($variationValue->stock < $item->quantity) {
                return response()->json([
                    'message' => "Số lượng tồn kho không đủ cho biến thể ID {$variationValue->id}. Yêu cầu: {$item->quantity}, Tồn kho: {$variationValue->stock}."
                ], 400);
            }

            $don_gia = $variationValue->price;
            $total_amount = $item->quantity * $don_gia;

            BillDetail::create([
                'bill_id' => $bill->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'don_gia' => $don_gia,
                'total_amount' => $total_amount,
                'product_variation_value_id' => $item->product_variation_value_id,
            ]);
        }

        // Xóa các mục trong giỏ hàng ngay sau khi tạo hóa đơn
        CartItem::whereIn('id', $request->cart_id)->delete();

        // Xử lý promotion_ids nếu có
        $promotionIds = json_decode($bill->promotion_ids);
        if (is_array($promotionIds)) {
            foreach ($promotionIds as $promotionId) {
                UserPromotion::create([
                    'user_id' => $bill->user_id,
                    'promotion_id' => $promotionId,
                ]);
            }
        }
        // Xử lý thanh toán
        if ($request->payment_method === 'paypal') {
            // Tạo order trên PayPal
            $provider = new PayPalClient;
            $provider->setApiCredentials(config('paypal'));
            $accessToken = $provider->getAccessToken();

            if (!$accessToken) {
                Log::error('PayPal authentication failed: Access token is null.');
                return response()->json(['error' => 'Không thể xác thực với PayPal. Vui lòng kiểm tra cấu hình API.'], 500);
            }

            $response = $provider->createOrder([
                "intent" => "CAPTURE",
                "application_context" => [
                    "return_url" => "http://localhost:8000/api/client/checkout/success?bill_id={$bill->id}",
                    "cancel_url" => "http://localhost:8000/api/client/checkout/cancel?bill_id={$bill->id}"
                ],
                "purchase_units" => [
                    [
                        "amount" => [
                            "currency_code" => "USD",
                            "value" => $this->exchangeRateService->convertVndToUsd($total)
                        ]
                    ]
                ]
            ]);

            if (isset($response['id']) && $response['id'] != null) {
                foreach ($response['links'] as $link) {
                    if ($link['rel'] === 'approve') {
                        return response()->json(['redirect_url' => $link['href']]);
                    }
                }
            } else {
                Log::error('PayPal order creation failed:', ['response' => $response]);
                return response()->json(['error' => 'Thanh toán PayPal không thành công.'], 500);
            }
        } elseif ($request->payment_method === 'vnpay') {
            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = "http://localhost:8000/api/client/payment/callback";
            $vnp_TmnCode = "943CGXVQ";
            $vnp_HashSecret = "WLQHP1MXDBOCOQZ56YQHESM95GC25M81";

            DB::beginTransaction();
            try {

                $codeOrders = $this->generateUniqueOrderCode();

                $shippingFee = $validatedData['shipping_fee'] ?? 0;
                $discountedAmount = $validatedData['discounted_amount'] ?? 0;
                $discountedShippingFee = $validatedData['discounted_shipping_fee'] ?? 0;
                // Tạo hóa đơn (Bill)
                $bill = Bill::create([
                    'user_id' => auth()->user()->id,
                    'code_orders' => $codeOrders,
                    'email_receiver' => auth()->user()->email,
                    'note' => $request->input('note'),
                    'status_bill' => 'pending',
                    'payment_type' => $request->input('payment_type'),
                    'subtotal' => $request->input('total'),
                    'total' => $request->input('total'),
                    'shipping_address_id' => $request->input('shipping_address_id'),
                    'promotion_ids' => json_encode($request->input('promotion_ids')),
                    'shipping_fee' => $shippingFee,
                    'discounted_amount' => $discountedAmount,
                    'discounted_shipping_fee' => $discountedShippingFee,
                ]);

                // Lấy danh sách cart_items dựa vào cart_id và thêm vào bill_details
                $cartItems = CartItem::whereIn('id', $request->input('cart_id'))->get();
                $subtotal = 0;
                $orderItems = [];

                foreach ($cartItems as $item) {
                    $variationValue = ProductVariationValue::findOrFail($item->product_variation_value_id);

                    // Kiểm tra tồn kho
                    if ($variationValue->stock < $item->quantity) {
                        return response()->json([
                            'message' => "Số lượng tồn kho không đủ cho biến thể ID {$variationValue->id}. Yêu cầu: {$item->quantity}, Tồn kho: {$variationValue->stock}"
                        ], 400);
                    }

                    $totalAmount = $variationValue->price * $item->quantity;
                    $subtotal += $totalAmount;

                    // Tạo bản ghi BillDetail
                    BillDetail::create([
                        'bill_id' => $bill->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'don_gia' => $variationValue->price,
                        'product_variation_value_id' => $item->product_variation_value_id,
                        'total_amount' => $totalAmount, // Thêm giá trị total_amount vào đây
                    ]);

                    $variationValue->decrement('stock', $item->quantity);
                    $variationValue->productVariation->decrement('stock', $item->quantity);
                    Product::findOrFail($item->product_id)->decrement('stock', $item->quantity);

                    $orderItems[] = [
                        'productName' => $item->product->name,
                        'size' => $variationValue->attributeValue->value,
                        'color' => $variationValue->productVariation->attributeValue->value,
                        'quantity' => $item->quantity,
                        'unitPrice' => $variationValue->price,
                        'total' => $totalAmount,
                        'image' => $item->productVariationValue->productVariation->variationImages()
                            ->where('image_type', 'album')
                            ->first()?->image_path,
                    ];
                }

                $bill->subtotal = $subtotal;
                $bill->total = $subtotal;
                $bill->save();

                // Gửi email xác nhận đơn hàng qua hàng đợi
                $orderData = $this->prepareOrderData($request, $bill, $orderItems);
                Mail::to($request->user()->email)->queue(new OrderConfirmationMail($orderData));

                // Tạo bản ghi Payment
                Payment::create([
                    'bill_id' => $bill->id,
                    'user_id' => auth()->user()->id,
                    'payment_method' => $request->input('payment_method'), // Lấy request để xác định cổng thanh toán
                    'amount' => $request->input('total'),
                    'status' => 'pending',
                    'transaction_id' => null,
                    'bank_code' => 'NCB',
                    'order_info' => 'Thanh toán đơn hàng #' . $bill->id,
                    'pay_type' => 'online',
                    'pay_date' => null,
                    'canceled_reason' => null,
                ]);

                // Chuẩn bị URL cho VNPay
                $inputData = [
                    "vnp_Version" => "2.1.0",
                    "vnp_TmnCode" => $vnp_TmnCode,
                    "vnp_Amount" => $request->input('total') * 100,
                    "vnp_Command" => "pay",
                    "vnp_CreateDate" => date('YmdHis'),
                    "vnp_CurrCode" => "VND",
                    "vnp_IpAddr" => $_SERVER['REMOTE_ADDR'],
                    "vnp_Locale" => 'vn',
                    "vnp_OrderInfo" => 'Thanh toán đơn hàng #' . $codeOrders,
                    "vnp_OrderType" => 'bill payment',
                    "vnp_ReturnUrl" => $vnp_Returnurl,
                    "vnp_TxnRef" => $bill->id
                ];

                ksort($inputData);
                $hashdata = http_build_query($inputData);
                $vnp_Url .= '?' . $hashdata;

                if ($vnp_HashSecret) {
                    $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
                    $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
                }

                // // Xóa các mục trong giỏ hàng sau khi tạo bill
                CartItem::whereIn('id', $request->input('cart_id'))->delete();

                DB::commit();
                return response()->json([
                    'code' => '00',
                    'message' => 'success',
                    'data' => $vnp_Url
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['code' => '99', 'message' => 'Transaction failed', 'error' => $e->getMessage()]);
            }
        }
        return response()->json(['error' => 'Phương thức thanh toán không hợp lệ.'], 400);
    }

    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));

        $token = $request->input('token');
        $payerID = $request->input('PayerID');
        $billId = $request->input('bill_id');

        if (!$token || !$payerID || !$billId) {
            Log::error("Thiếu thông tin thanh toán.", ['token' => $token, 'payerID' => $payerID, 'bill_id' => $billId]);
            return response()->json(['error' => 'Thiếu thông tin thanh toán.'], 400);
        }

        $accessToken = $provider->getAccessToken();
        if (!$accessToken) {
            Log::error('PayPal authentication failed: Access token is null.');
            return response()->json(['error' => 'Không thể xác thực với PayPal.'], 500);
        }

        try {
            $response = $provider->capturePaymentOrder($token);
        } catch (\Exception $e) {
            Log::error("Error capturing payment order: " . $e->getMessage());
            return response()->json(['error' => 'Lỗi trong quá trình xác nhận thanh toán.'], 500);
        }

        if (isset($response['status']) && $response['status'] === 'COMPLETED') {
            $bill = Bill::with('billDetail')->find($billId);
            if (!$bill) {
                return response()->json(['error' => 'Không tìm thấy hóa đơn.'], 404);
            }

            // Lưu thông tin thanh toán vào bảng payments
            $payment = Payment::create([
                'bill_id' => $bill->id,
                'user_id' => $bill->user_id,
                'payment_method' => Payment::METHOD_PAYPAL,
                'amount' => $bill->total,
                'status' => Payment::STATUS_PAID,
                'transaction_id' => $response['id'], // ID giao dịch từ PayPal
                'currency_code' => $response['purchase_units'][0]['amount']['currency_code'] ?? 'USD',
                'payer_id' => $payerID,
                'payer_email' => $response['payer']['email_address'] ?? null,
                'transaction_fee' => $response['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown']['paypal_fee']['value'] ?? 0,
                'receipt_code' => $response['purchase_units'][0]['payments']['captures'][0]['id'] ?? null,
                'pay_date' => now(),
            ]);

            // Cập nhật trạng thái hóa đơn
            $bill->status_bill = 'completed';
            $bill->save();

            // Lấy danh sách sản phẩm từ billDetails
            $orderItems = [];
            if ($bill->billDetail && $bill->billDetail->count() > 0) {
                foreach ($bill->billDetail as $item) {
                    $variationValue = ProductVariationValue::find($item->product_variation_value_id);

                    $orderItems[] = [
                        'productName' => $item->product->name ?? 'N/A',
                        'size' => $variationValue->attributeValue->value ?? 'N/A',
                        'color' => $variationValue->productVariation->attributeValue->value ?? 'N/A',
                        'quantity' => $item->quantity ?? 0,
                        'unitPrice' => $item->don_gia ?? 0,
                        'total' => $item->total_amount ?? 0,
                        'image' => $variationValue->productVariation->variationImages()
                            ->where('image_type', 'album')
                            ->first()?->image_path ?? null,
                    ];
                }
            } else {
                Log::warning('No bill details found for bill ID: ' . $bill->id);
            }

            // Gửi email xác nhận đơn hàng
            try {
                $orderData = $this->prepareOrderData($request, $bill, $orderItems);
                Mail::to($bill->email_receiver)->queue(new OrderConfirmationMail($orderData));
            } catch (\Exception $e) {
                Log::error('Failed to send order confirmation email.', ['error' => $e->getMessage()]);
            }

            return response()->json(['message' => 'Thanh toán thành công và đơn hàng đã được tạo.', 'bill_id' => $bill->id]);
        } else {
            $errorDetails = isset($response['details']) ? json_encode($response['details']) : 'Unknown error';
            Log::error('PayPal payment capture failed', ['response' => $response, 'errorDetails' => $errorDetails]);
            return response()->json(['error' => 'Thanh toán thất bại.', 'details' => $errorDetails], 500);
        }
    }


    public function vnpayCallback(Request $request)
    {
        $vnp_HashSecret = "WLQHP1MXDBOCOQZ56YQHESM95GC25M81";
        $vnp_SecureHash = $request->get('vnp_SecureHash');

        $inputData = $request->all();
        unset($inputData['vnp_SecureHash']);

        ksort($inputData);
        $hashdata = '';

        foreach ($inputData as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            $hashdata .= '&' . urldecode($key) . '=' . urlencode($value);
        }
        $hashdata = ltrim($hashdata, '&');

        $secureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        if ($secureHash == $vnp_SecureHash) {
            $vnp_TxnRef = $request->get('vnp_TxnRef');
            $vnp_BankCode = $request->get('vnp_BankCode');
            $vnp_OrderInfo = $request->get('vnp_OrderInfo');
            // Hash hợp lệ, xử lý lưu vào database
            $transactionStatus = $request->get('vnp_TransactionStatus');
            $bill = Bill::find($vnp_TxnRef);
            if (!$bill) {
                return response()->json(['message' => 'Bill not found'], 404);
            }
            $orderDetails = [];
            foreach ($bill->billDetail as $detail) {
                $orderDetails[] = [
                    'product_id' => $detail->product_id,
                    'variations' => [
                        [
                            'product_variation_value_id' => $detail->product_variation_value_id,
                            'quantity' => $detail->quantity,
                        ],
                    ],
                ];
            }
            $payment = Payment::where('bill_id', $vnp_TxnRef)->first();
            if ($transactionStatus == '00') {
                // Giao dịch thành công, lưu vào database
                $payment->update([
                    'status' => Payment::STATUS_PAID,
                    'transaction_id' => $vnp_TxnRef,
                    'pay_date' => now(),
                ]);
                $bill->status_bill = Bill::STATUS_PENDING;
                $bill->save();
                // CartItem::whereIn('id', $validatedData['cart_id'])->delete();
                return response()->json([
                    'code' => '00',
                    'total' => $bill->total,
                    'promotion_ids' => $bill->promotion_ids, // Nếu có trường này trong bảng bills
                    'note' => $bill->note, // Nếu có trường này trong bảng bills
                    'payment_type' => $bill->payment_type, // Nếu có trường này trong bảng bills
                    'payment_method' => $payment->payment_method, // Trả về cổng thanh toán đã chọn
                    'shipping_address_id' => $bill->shipping_address_id, // Nếu có trường này trong bảng bills
                    'order_details' => $orderDetails,
                    'shipping_fee' => $bill->shippingFee,
                    'discounted_amount' => $bill->discountedAmount,
                    'discounted_shipping_fee' => $bill->discountedShippingFee,
                    'message' => 'Payment processed successfully, cart items cleared'
                ]);
            } else {
                $payment->update([
                    'status' => Payment::STATUS_FAILED,
                    'canceled_reason' => 'Transaction failed',
                ]);
                $bill->status_bill = 'failed';
                $bill->save();
                // Giao dịch không thành công, xử lý logic thất bại
            }
        } else {
            return response()->json(['message' => 'Invalid signature'], 400);
        }
    }

    private function prepareOrderData($request, $bill, $orderItems)
    {
        return [
            'customerName' => $request->user()->name,
            'orderId' => $bill->code_orders,
            'orderDate' => now()->format('d/m/Y H:i'),
            'paymentType' => $bill->getLoaiThanhToan(),
            'shippingAddress' => $bill->shippingAddress->address_line,
            'phoneNumber' => $bill->shippingAddress->phone_number,
            'orderItems' => $orderItems,
            'totalAmount' => $bill->total,
        ];
    }

    public function cancel(Request $request)
    {
        $billId = $request->input('bill_id');

        // Kiểm tra sự tồn tại của bill_id
        if (!$billId) {
            return response()->json(['error' => 'Thiếu thông tin hóa đơn (bill_id).'], 400);
        }

        // Tìm hóa đơn (Bill) dựa trên bill_id
        $bill = Bill::find($billId);
        if (!$bill) {
            return response()->json(['error' => 'Không tìm thấy hóa đơn.'], 404);
        }

        // Cập nhật trạng thái hóa đơn thành "canceled"
        $bill->update([
            'status_bill' => 'canceled',
        ]);

        // Lấy hoặc tạo bản ghi Payment tương ứng
        $payment = Payment::firstOrCreate(
            ['bill_id' => $billId], // Điều kiện để tìm bản ghi
            [
                'user_id' => $bill->user_id,
                'payment_method' => Payment::METHOD_PAYPAL,
                'amount' => $bill->total,
                'status' => Payment::STATUS_PENDING, // Trạng thái mặc định nếu mới tạo
                'transaction_id' => null,
                'bank_code' => null,
                'order_info' => "Thanh toán hóa đơn #{$billId}",
                'pay_type' => $bill->payment_type,
                'pay_date' => now(),
                'canceled_reason' => 'User canceled the payment.',
            ]
        );

        // Cập nhật trạng thái Payment thành "failed"
        $payment->update([
            'status' => Payment::STATUS_FAILED,
            'canceled_reason' => 'User canceled the payment.',
        ]);

        // Ghi lại thông tin hủy thanh toán vào log
        Log::info('User canceled the payment process.', [
            'bill_id' => $billId,
            'user_id' => $bill->user_id,
            'payment_id' => $payment->id,
        ]);

        return response()->json(['message' => 'Bạn đã hủy bỏ thanh toán.']);
    }
}
