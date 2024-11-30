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
use DB;
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
        $validatedData = $request->validate([
            'total' => 'required|numeric',
            'promotion_ids' => 'nullable|array',
            'note' => 'nullable|string',
            'payment_type' => 'required|string',
            'payment_method' => 'required|string', // Xác định cổng thanh toán
            'shipping_address_id' => 'required|integer',
            'cart_id' => 'required|array',
            'shipping_fee' => 'nullable|numeric|min:0',
            'discounted_amount' => 'nullable|numeric|min:0',
            'discounted_shipping_fee' => 'nullable|numeric|min:0',

        ]);

        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:8000/api/client/payment/callback";
        // $vnp_Returnurl = "https://vn.mlb-korea.com/";

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
                'status_bill' => Bill::STATUS_PENDING,
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
            }

            $bill->subtotal = $subtotal;
            $bill->total = $subtotal;
            $bill->save();

            // Gửi email xác nhận đơn hàng qua hàng đợi
            // $orderData = $this->prepareOrderData($request, $bill, $orderItems);
            // Mail::to($request->user()->email)->queue(new OrderConfirmationMail($orderData));

            // Tạo bản ghi Payment
            Payment::create([
                'bill_id' => $bill->id,
                'user_id' => auth()->user()->id,
                'payment_method' => Payment::METHOD_VNPAY, // Lấy request để xác định cổng thanh toán
                'amount' => $request->input('total'),
                'status' => Payment::STATUS_PENDING,
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



    // public function vnpayCallback(Request $request)
    // {
    //     $vnp_HashSecret = "WLQHP1MXDBOCOQZ56YQHESM95GC25M81";
    //     $vnp_SecureHash = $request->get('vnp_SecureHash');

    //     $inputData = $request->all();
    //     unset($inputData['vnp_SecureHash']);

    //     ksort($inputData);
    //     $hashdata = '';

    //     foreach ($inputData as $key => $value) {
    //         if (is_array($value)) {
    //             $value = json_encode($value);
    //         }
    //         $hashdata .= '&' . urldecode($key) . '=' . urlencode($value);
    //     }
    //     $hashdata = ltrim($hashdata, '&');

    //     $secureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
    //     if ($secureHash == $vnp_SecureHash) {
    //         $vnp_TxnRef = $request->get('vnp_TxnRef');
    //         $vnp_BankCode = $request->get('vnp_BankCode');
    //         $vnp_OrderInfo = $request->get('vnp_OrderInfo');
    //         // Hash hợp lệ, xử lý lưu vào database
    //         $transactionStatus = $request->get('vnp_TransactionStatus');
    //         $bill = Bill::find($vnp_TxnRef);
    //         if (!$bill) {
    //             return response()->json(['message' => 'Bill not found'], 404);
    //         }
    //         $orderDetails = [];
    //         foreach ($bill->billDetail as $detail) {
    //             $orderDetails[] = [
    //                 'product_id' => $detail->product_id,
    //                 'variations' => [
    //                     [
    //                         'product_variation_value_id' => $detail->product_variation_value_id,
    //                         'quantity' => $detail->quantity,
    //                     ],
    //                 ],
    //             ];
    //         }
    //         $payment = Payment::where('bill_id', $vnp_TxnRef)->first();
    //         if ($transactionStatus == '00') {
    //             // Giao dịch thành công, lưu vào database
    //             $payment->update([
    //                 'status' => Payment::STATUS_PAID,
    //                 'transaction_id' => $vnp_TxnRef,
    //                 'pay_date' => now(),
    //             ]);



    //             $bill->status_bill = Bill::STATUS_PENDING;
    //             $bill->save();
    //             // CartItem::whereIn('id', $validatedData['cart_id'])->delete();
    //             return response()->json([
    //                 'code' => '00',
    //                 'total' => $bill->total,
    //                 'promotion_ids' => $bill->promotion_ids, // Nếu có trường này trong bảng bills
    //                 'note' => $bill->note, // Nếu có trường này trong bảng bills
    //                 'payment_type' => $bill->payment_type, // Nếu có trường này trong bảng bills
    //                 'payment_method' => $payment->payment_method, // Trả về cổng thanh toán đã chọn
    //                 'shipping_address_id' => $bill->shipping_address_id, // Nếu có trường này trong bảng bills
    //                 'order_details' => $orderDetails,
    //                 'shipping_fee' => $bill->shipping_fee,
    //                 'discounted_amount' => $bill->discounted_amount,
    //                 'discounted_shipping_fee' => $bill->discounted_shipping_fee,
    //                 'message' => 'Payment processed successfully, cart items cleared'
    //             ]);
    //             // foreach ($bill->billDentail as $dentails) {
    //             //     BillDetail::create([
    //             //         'bill_id' => $bill->id,
    //             //         'product_id' => $dentails->product_id,
    //             //         'quantity' => $dentails->quantity,
    //             //         'price' => $dentails->price,
    //             //         'don_gia' => $dentails->don_gia,
    //             //         'total_amount' => $dentails->total_amount,
    //             //         'created_at' => now(),
    //             //         'updated_at' => now(),
    //             //     ]);
    //             // }
    //             // return response()->json(['message' => 'Payment processed successfully']);
    //         } else {
    //             $payment->update([
    //                 'status' => Payment::STATUS_FAILED,
    //                 'canceled_reason' => 'Transaction failed',
    //             ]);
    //             $bill->status_bill = 'failed';
    //             $bill->save();
    //             // Giao dịch không thành công, xử lý logic thất bại
    //         }
    //     } else {
    //         return response()->json(['message' => 'Invalid signature'], 400);
    //     }
    // }


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
            $vnp_TxnRef = $request->get('vnp_TxnRef'); // ID hóa đơn
            $transactionStatus = $request->get('vnp_TransactionStatus'); // Trạng thái giao dịch

            $bill = Bill::with('billDetail.productVariationValue')->find($vnp_TxnRef); // Lấy hóa đơn và chi tiết
            if (!$bill) {
                return response()->json(['message' => 'Bill not found'], 404);
            }

            $payment = Payment::where('bill_id', $vnp_TxnRef)->first();
            if (!$payment) {
                return response()->json(['message' => 'Payment record not found'], 404);
            }

            if ($transactionStatus == '00') {
                // **1. Cập nhật trạng thái thanh toán**
                $payment->update([
                    'status' => Payment::STATUS_PAID,
                    'transaction_id' => $vnp_TxnRef,
                    'pay_date' => now(),
                ]);

                // **2. Cập nhật trạng thái hóa đơn**
                $bill->update(['status_bill' => Bill::STATUS_PENDING]);

                // **3. Cập nhật kho hàng**
                foreach ($bill->billDetail as $detail) {
                    $variationValue = $detail->productVariationValue;

                    if ($variationValue) {
                        $variationValue->decrement('stock', $detail->quantity);
                        $variationValue->productVariation->decrement('stock', $detail->quantity);
                        $variationValue->productVariation->product->decrement('stock', $detail->quantity);
                    }
                }

                // **4. Gửi email xác nhận đơn hàng**
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

                try {
                    $orderData = $this->prepareOrderData($request, $bill, $orderItems);
                    Mail::to($bill->email_receiver)->queue(new OrderConfirmationMail($orderData));
                } catch (\Exception $e) {
                    \Log::error('Error sending email:', ['error' => $e->getMessage()]);
                }

                // return response()->json([
                //     'code' => '00',
                //     'message' => 'Payment processed successfully',
                //     'bill_id' => $bill->id,
                // ]);

                return redirect('http://localhost:5173/account?status=success');
            } else {
                // **5. Xử lý khi giao dịch thất bại**
                $payment->update([
                    'status' => Payment::STATUS_FAILED,
                    'canceled_reason' => 'Transaction failed',
                ]);
                $bill->update(['status_bill' => 'failed']);
                return response()->json(['message' => 'Transaction failed'], 400);
            }
        } else {
            return response()->json(['message' => 'Invalid signature'], 400);
        }
    }
}
