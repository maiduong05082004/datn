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

            if ($price === null) {
                Log::error("Sản phẩm hoặc biến thể không có giá (Product ID: {$item->product_id}, Variation ID: {$item->product_variation_value_id})");
                return 0;
            }

            return $price * $item->quantity;
        });

        try {
            $totalAmountUsd = $this->exchangeRateService->convertVndToUsd($totalAmountVnd);
        } catch (\Exception $e) {
            Log::error('Currency conversion error: ' . $e->getMessage());
            return response()->json(['error' => 'Không thể chuyển đổi tiền tệ. Vui lòng thử lại sau.'], 500);
        }

        $addressData = [];
        if ($request->has('shipping_address_id')) {
            $shippingAddress = ShippingAddress::find($request->shipping_address_id);
            if ($shippingAddress) {
                $addressData = [
                    'name' => $user->name,
                    'phone' => $shippingAddress->phone_number,
                    'email' => $user->email,
                    'address' => $shippingAddress->address_line,
                    'city' => $shippingAddress->city,
                    'district' => $shippingAddress->district,
                    'ward' => $shippingAddress->ward,
                ];
            }
        } else {
            $addressData = $request->only(['name', 'phone', 'email', 'address', 'city', 'district', 'ward']);
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
                    "return_url" => "http://127.0.0.1:8000/api/client/checkout/success",
                    "cancel_url" => "http://127.0.0.1:8000/api/client/checkout/cancel"
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
                $errorDetails = isset($response['details']) ? json_encode($response['details']) : 'Unknown error';
                Log::error('PayPal order creation failed:', ['response' => $response]);
                return response()->json(['error' => 'Thanh toán PayPal không thành công.', 'details' => $errorDetails], 500);
            }
        }

        return response()->json(['error' => 'Phương thức thanh toán không hợp lệ.'], 400);
    }

    public function success(Request $request)
{
    $provider = new PayPalClient;
    $provider->setApiCredentials(config('paypal'));

    $accessToken = $provider->getAccessToken();
    if (!$accessToken) {
        Log::error('PayPal authentication failed');
        return response()->json(['error' => 'Không thể xác thực với PayPal.'], 500);
    }

    $response = $provider->capturePaymentOrder($request->token);

    // Log chi tiết phản hồi từ PayPal
    Log::info('PayPal Capture Payment Response:', ['response' => $response]);

    // Kiểm tra phản hồi từ PayPal
    if (isset($response['status']) && $response['status'] === 'COMPLETED') {
        $user = Auth::user();
        $cart = CartItem::where('user_id', $user->id)->get();

        if ($cart->isEmpty()) {
            Log::error('Giỏ hàng trống sau khi thanh toán thành công.');
            return response()->json(['error' => 'Giỏ hàng trống sau khi thanh toán thành công.'], 500);
        }

        $totalAmountVnd = $cart->sum(function ($item) {
            $price = $item->productVariationValue && $item->productVariationValue->price
                ? $item->productVariationValue->price
                : $item->product->price;

            if ($price === null) {
                Log::error("Sản phẩm hoặc biến thể không có giá (Product ID: {$item->product_id}, Variation ID: {$item->product_variation_value_id})");
                return 0;
            }

            return $price * $item->quantity;
        });

        try {
            $totalAmountUsd = $this->exchangeRateService->convertVndToUsd($totalAmountVnd);
        } catch (\Exception $e) {
            Log::error('Currency conversion error: ' . $e->getMessage());
            return response()->json(['error' => 'Không thể chuyển đổi tiền tệ. Vui lòng thử lại sau.'], 500);
        }

        $orderCode = 'MD' . rand(1000, 9999) . 'H' . time();
        $bill = new Bill();
        $bill->user_id = $user->id;
        $bill->code_orders = $orderCode;
        $bill->email_receiver = $user->email;
        $bill->name = $request->name ?? $user->name;
        $bill->phone = $request->phone;
        $bill->address = $request->address;
        $bill->city = $request->city;
        $bill->district = $request->district;
        $bill->ward = $request->ward;
        $bill->payment_type = "PayPal";
        $bill->subtotal = $totalAmountVnd;
        $bill->total = $totalAmountVnd;
        $bill->status_bill = "COMPLETED";
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

        return response()->json(['message' => 'Payment successful and order has been placed.', 'order_id' => $bill->id]);
    } else {
        // Trả về chi tiết lỗi nếu thanh toán không hoàn thành
        $errorDetails = isset($response['details']) ? $response['details'] : 'Unknown error';
        Log::error('PayPal payment capture failed', ['response' => $response]);
        return response()->json(['error' => 'Payment failed.', 'details' => $errorDetails], 500);
    }
}


}
