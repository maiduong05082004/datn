<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    // Các phương thức khác...

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
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Tính tổng tiền bằng VND
        $cart = CartItem::where('user_id', Auth::id())->get();
        $totalAmountVnd = $cart->sum(function ($item) {
            return $item->don_gia * $item->quantity;
        });

        // Chuyển đổi tổng tiền sang USD
        try {
            $totalAmountUsd = $this->exchangeRateService->convertVndToUsd($totalAmountVnd);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Không thể chuyển đổi tiền tệ. Vui lòng thử lại sau.'
            ], 500);
        }

        session([
            'checkout_data' => $request->only(['name', 'phone', 'email', 'address', 'city', 'district', 'ward', 'payment_method']),
            'grand_total_vnd' => $totalAmountVnd,
            'grand_total_usd' => $totalAmountUsd
        ]);

        // Xử lý thanh toán bằng PayPal
        if (strtolower($request->payment_method) == 'paypal') {
            $provider = new PayPalClient;
            $provider->setApiCredentials(config('paypal'));
            $provider->setAccessToken($provider->getAccessToken());

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

            // Kiểm tra phản hồi từ PayPal
            if (isset($response['id']) && $response['id'] != null) {
                foreach ($response['links'] as $link) {
                    if ($link['rel'] === 'approve') {
                        return response()->json([
                            'redirect_url' => $link['href']
                        ]);
                    }
                }
            } else {
                return response()->json([
                    'error' => 'Thanh toán PayPal không thành công.'
                ], 500);
            }
        }

        return response()->json([
            'error' => 'Phương thức thanh toán không hợp lệ.'
        ], 400);
    }

    public function cancel()
    {
        return response()->json([
            'error' => 'Payment was canceled.'
        ], 400);
    }

    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->setAccessToken($provider->getAccessToken());

        // Capture the payment
        $response = $provider->capturePaymentOrder($request->token);

        // Kiểm tra phản hồi và lưu thông tin đơn hàng
        if (isset($response['status']) && $response['status'] === 'COMPLETED') {
            // Lấy thông tin từ session
            $checkoutData = session('checkout_data');
            $orderCode = 'MD' . rand(0000, 9999) . 'H' . time();

            // Lưu thông tin đơn hàng vào database
            $bill = new Bill();
            $bill->user_id = Auth::id();
            $bill->code_orders = $orderCode;
            $bill->email_receiver = $checkoutData['email'];
            $bill->name = $checkoutData['name']; // Thêm cột name nếu cần
            $bill->phone = $checkoutData['phone']; // Thêm cột phone nếu cần
            $bill->address = $checkoutData['address']; // Thêm cột address nếu cần
            $bill->city = $checkoutData['city']; // Thêm cột city nếu cần
            $bill->district = $checkoutData['district']; // Thêm cột district nếu cần
            $bill->ward = $checkoutData['ward']; // Thêm cột ward nếu cần
            $bill->payment_type = 'Paypal';
            $bill->subtotal = session('grand_total_vnd'); // Lưu tổng tiền bằng VND
            $bill->total = session('grand_total_vnd'); // Hoặc có thể lưu tổng sau khi áp dụng khuyến mãi
            $bill->status_bill = 'completed'; // Cập nhật trạng thái hóa đơn nếu cần
            $bill->save();

            // Lưu thông tin sản phẩm vào bảng bill_details
            $cartItems = CartItem::where('user_id', Auth::id())->get();
            foreach ($cartItems as $item) {
                $billDetail = new BillDetail();
                $billDetail->bill_id = $bill->id;
                $billDetail->product_id = $item->product_id;
                $billDetail->don_gia = $item->don_gia;
                $billDetail->quantity = $item->quantity;
                $billDetail->total_amount = $item->don_gia * $item->quantity;
                $billDetail->product_variation_value_id = $item->product_variation_value_id; // Nếu có
                $billDetail->save();
            }

            // Xóa giỏ hàng sau khi đặt hàng thành công
            CartItem::where('user_id', Auth::id())->delete();

            return response()->json([
                'message' => 'Payment successful and order has been placed.',
                'order_id' => $bill->id
            ]);
        } else {
            return response()->json([
                'error' => 'Payment failed.'
            ], 500);
        }
    }
}
