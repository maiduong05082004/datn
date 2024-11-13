<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\CartItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariationValue;
use Illuminate\Http\Request;
use App\Mail\OrderConfirmationMail;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    private function generateUniqueOrderCode()
    {
        do {
            $codeOrders = 'ORDER-' . strtoupper(uniqid());
        } while (Bill::where('code_orders', $codeOrders)->exists());

        return $codeOrders;
    }
    public function vnpayPayment(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'promotion_ids' => 'nullable|array',
            'note' => 'nullable|string',
            'payment_type' => 'required|string',
            'payment_method' => 'required|string', // Xác định cổng thanh toán
            'shipping_address_id' => 'required|integer',
            'cart_id' => 'required|array'
        ]);

        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:8000/api/client/payment/callback";
        $vnp_TmnCode = "943CGXVQ";
        $vnp_HashSecret = "WLQHP1MXDBOCOQZ56YQHESM95GC25M81";

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
            "vnp_OrderInfo" => 'Thanh toán đơn hàng #' . $bill->code_orders,
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

        // Xóa các mục trong giỏ hàng sau khi tạo bill
        CartItem::whereIn('id', $request->input('cart_id'))->delete();

        return response()->json([
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        ]);
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

                $userId = $bill->user_id;
                CartItem::where('user_id', $userId)->delete();
                return response()->json([
                    'code' => '00',
                    'total' => $bill->total,
                    'promotion_ids' => $bill->promotion_ids, // Nếu có trường này trong bảng bills
                    'note' => $bill->note, // Nếu có trường này trong bảng bills
                    'payment_type' => $bill->payment_type, // Nếu có trường này trong bảng bills
                    'payment_method' => $payment->payment_method, // Trả về cổng thanh toán đã chọn
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
}

// namespace App\Http\Controllers\Api\Admin;

// use App\Http\Controllers\Controller;
// use App\Models\Bill;
// use App\Models\BillDetail;
// use App\Models\CartItem;
// use App\Models\Payment;
// use App\Models\ProductVariationValue;
// use Illuminate\Http\Request;

// class PaymentController extends Controller
// {
//     private function generateUniqueOrderCode()
//     {
//         do {
//             $codeOrders = 'ORDER-' . strtoupper(uniqid());
//         } while (Bill::where('code_orders', $codeOrders)->exists());

//         return $codeOrders;
//     }
//     public function vnpayPayment(Request $request)
//     {
//         $request->validate([
//             'total' => 'required|numeric',
//             'promotion_ids' => 'nullable|array',
//             'note' => 'nullable|string',
//             'payment_type' => 'required|string',
//             'payment_method' => 'required|string', // Xác định cổng thanh toán
//             'shipping_address_id' => 'required|integer',
//             'cart_id' => 'required|array'
//         ]);

//         // Kiểm tra xem payment_method có phải là VNPay không
//         if ($request->input('payment_method') !== 'VNPay') {
//             return response()->json([
//                 'message' => 'Invalid payment method'
//             ], 400);
//         }

//         $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
//         $vnp_Returnurl = "http://localhost:8000/api/client/payment/callback";
//         $vnp_TmnCode = "943CGXVQ"; // Mã website tại VNPAY
//         $vnp_HashSecret = "WLQHP1MXDBOCOQZ56YQHESM95GC25M81"; // Chuỗi bí mật

//         $codeOrders = $this->generateUniqueOrderCode();

//         // Tạo hóa đơn (Bill)
//         $bill = Bill::create([
//             'user_id' => auth()->user()->id,
//             'code_orders' => $codeOrders,
//             'email_receiver' => auth()->user()->email,
//             'note' => $request->input('note'),
//             'status_bill' => 'pending',
//             'payment_type' => $request->input('payment_type'),
//             'subtotal' => $request->input('total'),
//             'total' => $request->input('total'),
//             'shipping_address_id' => $request->input('shipping_address_id'),
//             'promotion_ids' => json_encode($request->input('promotion_ids')),
//         ]);

//         $vnp_TxnRef = $bill->id;
//         $vnp_OrderInfo = 'Thanh toán đơn hàng #' . $vnp_TxnRef;
//         $vnp_OrderType = 'bill payment';
//         $vnp_Amount = $request->input('total') * 100;
//         $vnp_Locale = 'vn';
//         $vnp_BankCode = 'NCB';
//         $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

//         $inputData = [
//             "vnp_Version" => "2.1.0",
//             "vnp_TmnCode" => $vnp_TmnCode,
//             "vnp_Amount" => $vnp_Amount,
//             "vnp_Command" => "pay",
//             "vnp_CreateDate" => date('YmdHis'),
//             "vnp_CurrCode" => "VND",
//             "vnp_IpAddr" => $vnp_IpAddr,
//             "vnp_Locale" => $vnp_Locale,
//             "vnp_OrderInfo" => $vnp_OrderInfo,
//             "vnp_OrderType" => $vnp_OrderType,
//             "vnp_ReturnUrl" => $vnp_Returnurl,
//             "vnp_TxnRef" => $vnp_TxnRef,
//         ];

//         ksort($inputData);
//         $hashdata = http_build_query($inputData);
//         $vnp_Url .= '?' . $hashdata;

//         if (isset($vnp_HashSecret)) {
//             $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
//             $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
//         }

//         // Tạo bản ghi Payment
//         Payment::create([
//             'bill_id' => $bill->id,
//             'user_id' => auth()->user()->id,
//             'payment_method' => $request->input('payment_method'), // Lấy request để xác định cổng thanh toán
//             'amount' => $request->input('total'),
//             'status' => 'pending',
//             'transaction_id' => null,
//             'bank_code' => $vnp_BankCode,
//             'order_info' => $vnp_OrderInfo,
//             'pay_type' => 'online',
//             'pay_date' => null,
//             'canceled_reason' => null,
//         ]);

//         // Lấy danh sách cart_items dựa vào cart_id và thêm vào bill_details
//         $cartItems = CartItem::whereIn('id', $request->input('cart_id'))->get();
//         $subtotal = 0;

//         foreach ($cartItems as $item) {
//             // Lấy biến thể sản phẩm dựa vào product_variation_value_id
//             $variationValue = ProductVariationValue::findOrFail($item->product_variation_value_id);

//             // Kiểm tra tồn kho
//             if ($variationValue->stock < $item->quantity) {
//                 return response()->json([
//                     'message' => "Số lượng tồn kho không đủ cho biến thể ID {$variationValue->id}. Yêu cầu: {$item->quantity}, Tồn kho: {$variationValue->stock}"
//                 ], 400);
//             }

//             $don_gia = $variationValue->price; // Lấy đơn giá từ biến thể
//             $total_amount = $item->quantity * $don_gia;
//             $subtotal += $total_amount;

//             // Tạo bản ghi BillDetail
//             BillDetail::create([
//                 'bill_id' => $bill->id,
//                 'product_id' => $item->product_id,
//                 'quantity' => $item->quantity,
//                 'don_gia' => $don_gia,
//                 'total_amount' => $total_amount,
//                 'product_variation_value_id' => $item->product_variation_value_id,
//             ]);
//         }

//         $bill->subtotal = $subtotal;
//         $bill->total = $subtotal;
//         $bill->save();

//         // Xóa các mục trong giỏ hàng sau khi tạo bill
//         CartItem::whereIn('id', $request->input('cart_id'))->delete();

//         return response()->json([
//             'code' => '00',
//             'message' => 'success',
//             'data' => $vnp_Url
//         ]);
//     }


//     public function vnpayCallback(Request $request)
//     {
//         $vnp_HashSecret = "WLQHP1MXDBOCOQZ56YQHESM95GC25M81";
//         $vnp_SecureHash = $request->get('vnp_SecureHash');

//         $inputData = $request->all();
//         unset($inputData['vnp_SecureHash']);

//         ksort($inputData);
//         $hashdata = '';

//         foreach ($inputData as $key => $value) {
//             if (is_array($value)) {
//                 $value = json_encode($value);
//             }
//             $hashdata .= '&' . urldecode($key) . '=' . urlencode($value);
//         }
//         $hashdata = ltrim($hashdata, '&');

//         $secureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
//         if ($secureHash == $vnp_SecureHash) {
//             $vnp_TxnRef = $request->get('vnp_TxnRef');
//             $vnp_BankCode = $request->get('vnp_BankCode');
//             $vnp_OrderInfo = $request->get('vnp_OrderInfo');
//             // Hash hợp lệ, xử lý lưu vào database
//             $transactionStatus = $request->get('vnp_TransactionStatus');
//             $bill = Bill::find($vnp_TxnRef);
//             if (!$bill) {
//                 return response()->json(['message' => 'Bill not found'], 404);
//             }
//             $orderDetails = [];
//             foreach ($bill->billDetail as $detail) {
//                 $orderDetails[] = [
//                     'product_id' => $detail->product_id,
//                     'variations' => [
//                         [
//                             'product_variation_value_id' => $detail->product_variation_value_id,
//                             'quantity' => $detail->quantity,
//                         ],
//                     ],
//                 ];
//             }
//             $payment = Payment::where('bill_id', $vnp_TxnRef)->first();
//             if ($transactionStatus == '00') {
//                 // Giao dịch thành công, lưu vào database
//                 $payment->update([
//                     'status' => 'success',
//                     'transaction_id' => $vnp_TxnRef,
//                     'pay_date' => now(),
//                 ]);
//                 $bill->status_bill = 'completed';
//                 $bill->save();

//                 // $userId = $bill->user_id;
//                 // CartItem::where('user_id', $userId)->delete();
//                 // CartItem::whereIn('id', $request->input('cart_id'))->delete();
//                 return response()->json([
//                     'code' => '00',
//                     'total' => $bill->total,
//                     'promotion_ids' => $bill->promotion_ids, // Nếu có trường này trong bảng bills
//                     'note' => $bill->note, // Nếu có trường này trong bảng bills
//                     'payment_type' => $bill->payment_type, // Nếu có trường này trong bảng bills
//                     'payment_method' => $payment->payment_method, // Trả về cổng thanh toán đã chọn
//                     'shipping_address_id' => $bill->shipping_address_id, // Nếu có trường này trong bảng bills
//                     'order_details' => $orderDetails,
//                     'message' => 'Payment processed successfully, cart items cleared'
//                 ]);
//                 // foreach ($bill->billDentail as $dentails) {
//                 //     BillDetail::create([
//                 //         'bill_id' => $bill->id,
//                 //         'product_id' => $dentails->product_id,
//                 //         'quantity' => $dentails->quantity,
//                 //         'price' => $dentails->price,
//                 //         'don_gia' => $dentails->don_gia,
//                 //         'total_amount' => $dentails->total_amount,
//                 //         'created_at' => now(),
//                 //         'updated_at' => now(),
//                 //     ]);
//                 // }
//                 // return response()->json(['message' => 'Payment processed successfully']);
//             } else {
//                 $payment->update([
//                     'status' => 'failed',
//                     'canceled_reason' => 'Transaction failed',
//                 ]);
//                 $bill->status_bill = 'failed';
//                 $bill->save();
//                 // Giao dịch không thành công, xử lý logic thất bại
//             }
//         } else {
//             return response()->json(['message' => 'Invalid signature'], 400);
//         }
//     }
// }
