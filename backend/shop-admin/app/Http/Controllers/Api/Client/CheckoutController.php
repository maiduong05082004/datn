<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
use App\Models\ShippingAddress;
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

    public function submit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'ward' => 'nullable|string|max:255',
            'shipping_address_id' => 'nullable|exists:shipping_addresses,id',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        $cart = CartItem::where('user_id', $user->id)->get();
        if ($cart->isEmpty()) {
            return response()->json(['error' => 'Giỏ hàng của bạn đang trống.'], 400);
        }

        $totalAmountVnd = $cart->sum(function ($item) {
            $price = $item->productVariationValue && $item->productVariationValue->price
                ? $item->productVariationValue->price
                : $item->product->price;

            return $price * $item->quantity;
        });

        try {
            $totalAmountUsd = $this->exchangeRateService->convertVndToUsd($totalAmountVnd);
        } catch (\Exception $e) {
            Log::error('Currency conversion error: ' . $e->getMessage());
            return response()->json(['error' => 'Không thể chuyển đổi tiền tệ. Vui lòng thử lại sau.'], 500);
        }

        if ($request->has('shipping_address_id')) {
            $shippingAddressId = $request->shipping_address_id;
        } else {
            $shippingAddress = ShippingAddress::create([
                'user_id' => $user->id,
                'address_line' => $request->address,
                'city' => $request->city,
                'district' => $request->district,
                'ward' => $request->ward,
                'phone_number' => $request->phone,
                'is_default' => false
            ]);

            $shippingAddressId = $shippingAddress->id;
        }

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
                    "return_url" => "http://localhost:8000/payment-result?shipping_address_id={$shippingAddressId}",
                    "cancel_url" => "http://localhost:8000/api/client/checkout/cancel"
                ],
                "purchase_units" => [
                    [
                        "amount" => [
                            "currency_code" => "USD",
                            "value" => $totalAmountUsd
                        ]
                    ]
                ]
            ]);

            Log::info('PayPal Order Creation Response:', ['response' => $response]);

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
    }



    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));

        $token = $request->input('token');
        $payerID = $request->input('PayerID');
        $shippingAddressId = $request->input('shipping_address_id');

        Log::info("Received payment success request", [
            'token' => $token,
            'PayerID' => $payerID,
            'shipping_address_id' => $shippingAddressId
        ]);

        if (!$token || !$payerID) {
            Log::error("Missing token or PayerID in success request.");
            return response()->json(['error' => 'Thiếu thông tin thanh toán.'], 400);
        }

        $accessToken = $provider->getAccessToken();
        if (!$accessToken) {
            Log::error('PayPal authentication failed: Access token is null.');
            return response()->json(['error' => 'Không thể xác thực với PayPal.'], 500);
        }

        try {
            $response = $provider->capturePaymentOrder($token);
            Log::info('PayPal Capture Payment Response:', ['response' => $response]);
        } catch (\Exception $e) {
            Log::error("Error capturing payment order: " . $e->getMessage());
            return response()->json(['error' => 'Lỗi trong quá trình xác nhận thanh toán.'], 500);
        }

        if (isset($response['status']) && $response['status'] === 'COMPLETED') {
            $user = Auth::user();
            $cart = CartItem::where('user_id', $user->id)->get();

            if ($cart->isEmpty()) {
                Log::error('Giỏ hàng trống sau khi thanh toán thành công.');
                return response()->json(['error' => 'Giỏ hàng trống sau khi thanh toán.'], 500);
            }

            $totalAmountVnd = $cart->sum(function ($item) {
                $price = $item->productVariationValue && $item->productVariationValue->price
                    ? $item->productVariationValue->price
                    : $item->product->price;

                return $price * $item->quantity;
            });

            $orderCode = 'MD' . rand(1000, 9999) . 'H' . time();
            $bill = new Bill();
            $bill->user_id = $user->id;
            $bill->code_orders = $orderCode;
            $bill->email_receiver = $user->email;
            $bill->payment_type = Bill::PAYMENT_TYPE_ONLINE;
            $bill->subtotal = $totalAmountVnd;
            $bill->total = $totalAmountVnd;
            $bill->status_bill = "COMPLETED";

            if ($shippingAddressId) {
                $bill->shipping_address_id = $shippingAddressId;
            }

            $bill->save();

            foreach ($cart as $item) {
                $billDetail = new BillDetail();
                $billDetail->bill_id = $bill->id;
                $billDetail->product_id = $item->product_id;
                $billDetail->don_gia = $item->productVariationValue->price ?? $item->product->price;
                $billDetail->quantity = $item->quantity;
                $billDetail->total_amount = $billDetail->don_gia * $item->quantity;
                $billDetail->product_variation_value_id = $item->product_variation_value_id;
                $billDetail->save();
            }

            CartItem::where('user_id', $user->id)->delete();

            return response()->json(['message' => 'Thanh toán thành công và đơn hàng đã được tạo.', 'bill_id' => $bill->id]);
        } else {
            $errorDetails = isset($response['details']) ? json_encode($response['details']) : 'Unknown error';
            Log::error('PayPal payment capture failed', ['response' => $response, 'errorDetails' => $errorDetails]);
            return response()->json(['error' => 'Thanh toán thất bại.', 'details' => $errorDetails], 500);
        }
    }




    public function cancel(Request $request)
    {
        Log::info('User canceled the payment process.', ['request' => $request->all()]);

        return response()->json(['message' => 'Bạn đã hủy bỏ thanh toán. Giỏ hàng vẫn còn nguyên.']);
    }
}
