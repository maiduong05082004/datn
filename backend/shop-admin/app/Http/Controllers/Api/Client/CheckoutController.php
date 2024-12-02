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
        $billId = $bill->id;
        $payment = Payment::firstOrCreate(
            ['bill_id' => $billId],
            [
                'user_id' => $bill->user_id,
                'payment_method' => Payment::METHOD_PAYPAL,
                'amount' => $bill->total,
                'status' => Payment::STATUS_PENDING,
                'transaction_id' => null,
                'bank_code' => null,
                'order_info' => "Thanh toán hóa đơn #{$billId}",
                'pay_type' => $bill->payment_type,
                'pay_date' => now(),
                'canceled_reason' => 'User canceled the payment.',
            ]
        );

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
                        return response()->json(['data' => $link['href']]);
                    }
                }
            } else {
                Log::error('PayPal order creation failed:', ['response' => $response]);
                return response()->json(['error' => 'Thanh toán PayPal không thành công.'], 500);
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
            $bill = Bill::with(['billDetail.product', 'billDetail.productVariationValue'])->find($billId);
            if (!$bill) {
                return response()->json(['error' => 'Không tìm thấy hóa đơn.'], 404);
            }

            // Cập nhật bản ghi Payment
            $payment = Payment::where('bill_id', $bill->id)->first();
            if ($payment) {
                $payment->update([
                    'status' => Payment::STATUS_PAID,
                    'transaction_id' => $response['id'], // ID giao dịch từ PayPal
                    'currency_code' => $response['purchase_units'][0]['amount']['currency_code'] ?? 'USD',
                    'payer_id' => $payerID,
                    'payer_email' => $response['payer']['email_address'] ?? null,
                    'transaction_fee' => $response['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown']['paypal_fee']['value'] ?? 0,
                    'receipt_code' => $response['purchase_units'][0]['payments']['captures'][0]['id'] ?? null,
                    'pay_date' => now(),
                ]);
            } else {
                Log::warning("Không tìm thấy bản ghi Payment cho bill_id: {$bill->id}");
            }


            // Cập nhật kho sau khi thanh toán thành công
            foreach ($bill->billDetail as $detail) {
                $variationValue = $detail->productVariationValue;

                if ($variationValue) {
                    $variationValue->decrement('stock', $detail->quantity);
                    $variationValue->productVariation->decrement('stock', $detail->quantity);
                    $variationValue->productVariation->product->decrement('stock', $detail->quantity);
                }
            }

            // Chuẩn bị dữ liệu email
            $orderItems = [];
            foreach ($bill->billDetail as $item) {
                $variationValue = $item->productVariationValue;
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

            // Gửi email xác nhận đơn hàng
            try {
                $orderData = $this->prepareOrderData($request, $bill, $orderItems);
                Mail::to($bill->email_receiver)->queue(new OrderConfirmationMail($orderData));
            } catch (\Exception $e) {
                Log::error('Failed to send order confirmation email.', ['error' => $e->getMessage()]);
            }

            // return response()->json(['message' => 'Thanh toán thành công và trạng thái đã được cập nhật.', 'bill_id' => $bill->id]);
            return redirect('http://localhost:5173/account?status=success');

        } else {
            $errorDetails = isset($response['details']) ? json_encode($response['details']) : 'Unknown error';
            Log::error('PayPal payment capture failed', ['response' => $response, 'errorDetails' => $errorDetails]);
            return response()->json(['error' => 'Thanh toán thất bại.', 'details' => $errorDetails], 500);
        }
    }








    private function prepareOrderData($request, $bill, $orderItems)
    {
      
        $payment = Payment::where('bill_id', $bill->id)->first();

        return [
            'customerName' => $bill->shippingAddress->full_name,
            'orderId' => $bill->code_orders,
            'orderDate' => now()->format('d/m/Y H:i'),
            'paymentType' => $bill->getLoaiThanhToan(),
            'payment_method' => $payment ? $payment->getPaymentMethod() : 'Không rõ',
            'status' => $payment ? $payment->getPaymentStatus() : 'Không rõ',
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







    public function cancel(Request $request)
    {
        $billId = $request->input('bill_id');

        if (!$billId) {
            return response()->json(['error' => 'Thiếu thông tin hóa đơn (bill_id).'], 400);
        }

        $bill = Bill::find($billId);
        if (!$bill) {
            return response()->json(['error' => 'Không tìm thấy hóa đơn.'], 404);
        }

        // Cập nhật trạng thái hóa đơn
        $bill->update([
            'status_bill' => Bill::STATUS_CANCELED,
        ]);

        // Tìm và cập nhật trạng thái Payment
        $payment = Payment::where('bill_id', $bill->id)->first();
        if ($payment) {
            $payment->update([
                'status' => Payment::STATUS_FAILED,
                'canceled_reason' => 'User canceled the payment.',
            ]);
        } else {
            Log::warning("Không tìm thấy bản ghi Payment để hủy cho bill_id: {$bill->id}");
        }
        // return response()->json(['message' => 'Thanh toán thành công và trạng thái đã được cập nhật.', 'bill_id' => $bill->id]);
        return redirect('http://localhost:5173/account?status=failed');
        // return response()->json(['message' => 'Đơn hàng đã được hủy thành công.']);
    }




    private function processCartItems($cartIds, $bill, &$subtotal)
    {
        $orderItems = [];
        $cartItems = CartItem::whereIn('id', $cartIds)->get();

        foreach ($cartItems as $cartItem) {
            $variationValue = ProductVariationValue::findOrFail($cartItem->product_variation_value_id);
            $totalAmount = $variationValue->price * $cartItem->quantity;
            // $subtotal += $totalAmount;


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
}
