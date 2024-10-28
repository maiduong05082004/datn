<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
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
    // Kiểm tra các trường form
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'phone' => 'required|string|max:15',
        'email' => 'required|email|max:255',
        'address' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'district' => 'required|string|max:255',
        'ward' => 'required|string|max:255',
        'payment_method' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Lấy thông tin người dùng
    $user = Auth::user();

    // Tính tổng tiền VND và thông tin giỏ hàng
    $cart = CartItem::where('user_id', Auth::id())->get();
    if ($cart->isEmpty()) {
        return response()->json(['error' => 'Giỏ hàng của bạn đang trống.'], 400);
    }

    // Tính tổng tiền từ biến thể hoặc sản phẩm chính
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

    // Chuyển đổi tổng tiền sang USD
    try {
        $totalAmountUsd = $this->exchangeRateService->convertVndToUsd($totalAmountVnd);
    } catch (\Exception $e) {
        Log::error('Currency conversion error: ' . $e->getMessage());
        return response()->json(['error' => 'Không thể chuyển đổi tiền tệ. Vui lòng thử lại sau.'], 500);
    }

    // Ghi thông tin đầy đủ ra JSON response để kiểm tra
    $responseData = [
        'form_data' => $request->all(),
        'user_data' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ],
        'cart_data' => $cart->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'don_gia' => $item->productVariationValue && $item->productVariationValue->price
                            ? $item->productVariationValue->price 
                            : $item->product->price,
                'total_amount' => $item->quantity * (
                    $item->productVariationValue && $item->productVariationValue->price 
                    ? $item->productVariationValue->price 
                    : $item->product->price
                ),
                'variation_id' => $item->product_variation_value_id,
            ];
        }),
        'total_amount' => [
            'vnd' => $totalAmountVnd,
            'usd' => $totalAmountUsd,
        ],
    ];

    session([
        'checkout_data' => $request->only(['name', 'phone', 'email', 'address', 'city', 'district', 'ward', 'payment_method']),
        'grand_total_vnd' => $totalAmountVnd,
        'grand_total_usd' => $totalAmountUsd,
    ]);

    // Xử lý thanh toán với PayPal
    if (strtolower($request->payment_method) === 'paypal') {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));

        // Xác thực với PayPal
        $accessToken = $provider->getAccessToken();
        if (!$accessToken) {
            Log::error('PayPal authentication failed: Access token is null.');
            return response()->json(['error' => 'Không thể xác thực với PayPal. Vui lòng kiểm tra cấu hình API.'], 500);
        }

        // Tạo đơn hàng PayPal
        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('client.checkout.success'),
                "cancel_url" => route('client.checkout.cancel')
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

        // Ghi lại phản hồi từ PayPal
        Log::info('PayPal Order Creation Response:', ['response' => $response]);
        $responseData['paypal_response'] = $response;

        // Kiểm tra phản hồi từ PayPal
        if (isset($response['id']) && $response['id'] != null) {
            foreach ($response['links'] as $link) {
                if ($link['rel'] === 'approve') {
                    $responseData['redirect_url'] = $link['href'];
                    return response()->json($responseData);
                }
            }
        } else {
            $errorDetails = isset($response['details']) ? json_encode($response['details']) : 'Unknown error';
            Log::error('PayPal order creation failed:', ['response' => $response]);
            $responseData['error'] = 'Thanh toán PayPal không thành công.';
            $responseData['details'] = $errorDetails;
            return response()->json($responseData, 500);
        }
    }

    $responseData['error'] = 'Phương thức thanh toán không hợp lệ.';
    return response()->json($responseData, 400);
}


    public function cancel()
    {
        return response()->json(['error' => 'Payment was canceled.'], 400);
    }

    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));

        // Xác thực với PayPal
        $accessToken = $provider->getAccessToken();
        if (!$accessToken) {
            Log::error('PayPal authentication failed');
            return response()->json(['error' => 'Không thể xác thực với PayPal.'], 500);
        }

        // Capture thanh toán
        $response = $provider->capturePaymentOrder($request->token);

        if (isset($response['status']) && $response['status'] === 'COMPLETED') {
            $checkoutData = session('checkout_data');
            $orderCode = 'MD' . rand(1000, 9999) . 'H' . time();

            $bill = new Bill();
            $bill->user_id = Auth::id();
            $bill->code_orders = $orderCode;
            $bill->email_receiver = $checkoutData['email'];
            $bill->name = $checkoutData['name'];
            $bill->phone = $checkoutData['phone'];
            $bill->address = $checkoutData['address'];
            $bill->city = $checkoutData['city'];
            $bill->district = $checkoutData['district'];
            $bill->ward = $checkoutData['ward'];
            $bill->payment_type = 'Paypal';
            $bill->subtotal = session('grand_total_vnd');
            $bill->total = session('grand_total_vnd');
            $bill->status_bill = 'completed';
            $bill->save();

            $cart = CartItem::where('user_id', Auth::id())->get();
            foreach ($cart as $item) {
                $billDetail = new BillDetail();
                $billDetail->bill_id = $bill->id;
                $billDetail->product_id = $item->product_id;
                $billDetail->don_gia = $item->don_gia;
                $billDetail->quantity = $item->quantity;
                $billDetail->total_amount = $item->don_gia * $item->quantity;
                $billDetail->product_variation_value_id = $item->product_variation_value_id;
                $billDetail->save();
            }

            CartItem::where('user_id', Auth::id())->delete();

            return response()->json(['message' => 'Payment successful and order has been placed.', 'order_id' => $bill->id]);
        } else {
            Log::error('PayPal payment capture failed', ['response' => $response]);
            $errorDetails = isset($response['details']) ? $response['details'] : 'Unknown error';
            return response()->json(['error' => 'Payment failed.', 'details' => $errorDetails], 500);
        }
    }
}
