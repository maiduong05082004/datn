<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
use App\Models\Payment;
use App\Models\ShippingAddress;
use App\Models\ProductVariationValue;
use App\Models\UserPromotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use App\Services\ExchangeRateService;

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
        // Xử lý thanh toán theo phương thức
        if ($request->payment_method === 'paypal') {
            $validator = Validator::make($request->all(), [
                'total' => 'required|numeric|min:0',
                'promotion_ids' => 'nullable|array',
                'note' => 'nullable|string|max:255',
                'payment_type' => 'required|string|in:online,cash',
                'payment_method' => 'required|string|in:paypal',
                'shipping_address_id' => 'required|exists:shipping_addresses,id',
                'cart_id' => 'required|array',
                'cart_id.*' => 'integer|exists:cart_items,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Tạo hóa đơn tạm thời với trạng thái pending
            $bill = Bill::create([
                'user_id' => Auth::id(),
                'code_orders' => 'ORDER-' . strtoupper(uniqid()),
                'email_receiver' => Auth::user()->email,
                'payment_type' => $request->payment_type,
                'subtotal' => $request->total,
                'total' => $request->total,
                'status_bill' => 'pending',
                'shipping_address_id' => $request->shipping_address_id,
                'promotion_ids' => json_encode($request->promotion_ids),
                'note' => $request->note,
            ]);

            $cartIdParam = urlencode(json_encode($request->cart_id));

            // Khởi tạo thanh toán PayPal
            if (strtolower($request->payment_method) === 'paypal') {
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
                        "return_url" => "http://localhost:8000/api/client/checkout/success?bill_id={$bill->id}&cart_id={$cartIdParam}",
                        "cancel_url" => "http://localhost:8000/api/client/checkout/cancel"
                    ],
                    "purchase_units" => [
                        [
                            "amount" => [
                                "currency_code" => "USD",
                                "value" => $this->exchangeRateService->convertVndToUsd($request->total)
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
            }

            return response()->json(['error' => 'Phương thức thanh toán không hợp lệ.'], 400);
        } elseif ($request->payment_method === 'vnpay') {
            $request->validate([
                'total' => 'required|numeric',
                'promotion_ids' => 'nullable|array',
                'note' => 'nullable|string',
                'payment_type' => 'required|string',
                'shipping_address_id' => 'required|integer',
                'cart_id' => 'required|array'
            ]);

            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = "http://localhost:8000/api/client/checkout/callback";
            $vnp_TmnCode = "943CGXVQ"; // Mã website tại VNPAY
            $vnp_HashSecret = "WLQHP1MXDBOCOQZ56YQHESM95GC25M81"; // Chuỗi bí mật

            $codeOrders = $this->generateUniqueOrderCode();

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
            ]);

            $vnp_TxnRef = $bill->id;
            $vnp_OrderInfo = 'Thanh toán đơn hàng #' . $vnp_TxnRef;
            $vnp_OrderType = 'bill payment';
            $vnp_Amount = $request->input('total') * 100;
            $vnp_Locale = 'vn';
            $vnp_BankCode = 'NCB';
            $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

            $inputData = [
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => $vnp_OrderType,
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef,
            ];

            ksort($inputData);
            $hashdata = http_build_query($inputData);
            $vnp_Url .= '?' . $hashdata;

            if (isset($vnp_HashSecret)) {
                $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
                $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
            }

            // Tạo bản ghi Payment
            Payment::create([
                'bill_id' => $bill->id,
                'user_id' => auth()->user()->id,
                'payment_method' => 'VNPay',
                'amount' => $request->input('total'),
                'status' => 'pending',
                'transaction_id' => null,
                'bank_code' => $vnp_BankCode,
                'order_info' => $vnp_OrderInfo,
                'pay_type' => 'online',
                'pay_date' => null,
                'canceled_reason' => null,
            ]);

            // Lấy danh sách cart_items dựa vào cart_id và thêm vào bill_details
            $cartItems = CartItem::whereIn('id', $request->input('cart_id'))->get();
            $subtotal = 0;

            foreach ($cartItems as $item) {
                // Lấy biến thể sản phẩm dựa vào product_variation_value_id
                $variationValue = ProductVariationValue::findOrFail($item->product_variation_value_id);

                // Kiểm tra tồn kho
                if ($variationValue->stock < $item->quantity) {
                    return response()->json([
                        'message' => "Số lượng tồn kho không đủ cho biến thể ID {$variationValue->id}. Yêu cầu: {$item->quantity}, Tồn kho: {$variationValue->stock}"
                    ], 400);
                }

                $don_gia = $variationValue->price; // Lấy đơn giá từ biến thể
                $total_amount = $item->quantity * $don_gia;
                $subtotal += $total_amount;

                // Tạo bản ghi BillDetail
                BillDetail::create([
                    'bill_id' => $bill->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'don_gia' => $don_gia,
                    'total_amount' => $total_amount,
                    'product_variation_value_id' => $item->product_variation_value_id,
                ]);
            }

            $bill->subtotal = $subtotal;
            $bill->total = $subtotal;
            $bill->save();

            // Xóa các mục trong giỏ hàng sau khi tạo bill
            CartItem::whereIn('id', $request->input('cart_id'))->delete();

            return response()->json([
                'code' => '00',
                'message' => 'success',
                'data' => $vnp_Url
            ]);
        }
    }


    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));

        $token = $request->input('token');
        $payerID = $request->input('PayerID');
        $billId = $request->input('bill_id');
        $cartIds = json_decode(urldecode($request->input('cart_id')), true); // Decode cart_id from URL

        if (!$token || !$payerID || !$billId) {
            Log::error("Thiếu thông tin thanh toán.");
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
            $bill = Bill::find($billId);
            if (!$bill) {
                return response()->json(['error' => 'Không tìm thấy hóa đơn.'], 404);
            }

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

            // Lưu thông tin thanh toán vào bảng payments
            $payment = new Payment();
            $payment->bill_id = $bill->id;
            $payment->user_id = $bill->user_id;
            $payment->payment_method = Payment::METHOD_PAYPAL;
            $payment->amount = $bill->total;
            $payment->status = Payment::STATUS_PAID;
            $payment->transaction_id = $response['id']; // ID giao dịch từ PayPal
            $payment->currency_code = $response['purchase_units'][0]['amount']['currency_code'] ?? 'USD';
            $payment->payer_id = $payerID;
            $payment->payer_email = $response['payer']['email_address'] ?? null;
            $payment->transaction_fee = $response['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown']['paypal_fee']['value'] ?? 0;
            $payment->receipt_code = $response['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;
            $payment->pay_date = now();
            $payment->save();

            // Cập nhật trạng thái hóa đơn
            $bill->status_bill = "COMPLETED";
            $bill->save();

            // Xóa các mục trong giỏ hàng theo cart_id từ URL nếu thanh toán thành công
            if (is_array($cartIds)) {
                CartItem::whereIn('id', $cartIds)->delete();
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
                    'status' => 'success',
                    'transaction_id' => $vnp_TxnRef,
                    'pay_date' => now(),
                ]);
                $bill->status_bill = 'COMPLETED';
                $bill->save();

                if ($bill->promotion_ids !== null) {
                    $promotionIds = json_decode($bill->promotion_ids);

                    // Kiểm tra nếu $promotionIds là mảng trước khi duyệt
                    if (is_array($promotionIds)) {
                        foreach ($promotionIds as $promotionId) {
                            UserPromotion::create([
                                'user_id' => $bill->user_id,
                                'promotion_id' => $promotionId,
                            ]);
                        }
                    }
                }

                $userId = $bill->user_id;
                return response()->json([
                    'code' => '00',
                    'total' => $bill->total,
                    'promotion_ids' => $bill->promotion_ids, // Nếu có trường này trong bảng bills
                    'note' => $bill->note, // Nếu có trường này trong bảng bills
                    'payment_type' => $bill->payment_type, // Nếu có trường này trong bảng bills
                    'shipping_address_id' => $bill->shipping_address_id, // Nếu có trường này trong bảng bills
                    'order_details' => $orderDetails,
                    'message' => 'Payment processed successfully, cart items cleared'
                ]);
                // foreach ($bill->billDentail as $dentails) {
                //     BillDetail::create([
                //         'bill_id' => $bill->id,
                //         'product_id' => $dentails->product_id,
                //         'quantity' => $dentails->quantity,
                //         'price' => $dentails->price,
                //         'don_gia' => $dentails->don_gia,
                //         'total_amount' => $dentails->total_amount,
                //         'created_at' => now(),
                //         'updated_at' => now(),
                //     ]);
                // }
                // return response()->json(['message' => 'Payment processed successfully']);
            } else {
                $payment->update([
                    'status' => 'failed',
                    'canceled_reason' => 'Transaction failed',
                ]);
                $bill->status_bill = 'FAILED';
                $bill->save();
                // Giao dịch không thành công, xử lý logic thất bại
            }
        } else {
            return response()->json(['message' => 'Invalid signature'], 400);
        }
    }

    public function cancel(Request $request)
    {
        Log::info('User canceled the payment process.', ['request' => $request->all()]);
        return response()->json(['message' => 'Bạn đã hủy bỏ thanh toán. Giỏ hàng vẫn còn nguyên.']);
    }
}
