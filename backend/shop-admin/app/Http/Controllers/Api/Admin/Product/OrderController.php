<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class OrderController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $startTime = $request->input('start_time');
        $endTime = $request->input('end_time');
        $perPage = $request->input('per_page', 10);
        $phone = $request->input('phone');
        $paymentType = $request->input('payment_type');
        $promotionCode = $request->input('promotion_code');

        if ($startDate && $startTime) {
            $startDateTime = Carbon::parse("$startDate $startTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $startDateTime = $startDate ? Carbon::parse($startDate)->startOfDay()->setTimezone('UTC') : null;
        }

        if ($endDate && $endTime) {
            $endDateTime = Carbon::parse("$endDate $endTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $endDateTime = $endDate ? Carbon::parse($endDate)->endOfDay()->setTimezone('UTC') : null;
        }

        return $this->getOrdersByStatus(null, $perPage, $startDateTime, $endDateTime, $phone, $paymentType, $promotionCode);
    }


    public function pendingOrders(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $startTime = $request->input('start_time');
        $endTime = $request->input('end_time');
        $perPage = $request->input('per_page', 10);
        $phone = $request->input('phone');
        $paymentType = $request->input('payment_type');
        $promotionCode = $request->input('promotion_code');


        if ($startDate && $startTime) {
            $startDateTime = Carbon::parse("$startDate $startTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $startDateTime = $startDate ? Carbon::parse($startDate)->startOfDay()->setTimezone('UTC') : null;
        }

        if ($endDate && $endTime) {
            $endDateTime = Carbon::parse("$endDate $endTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $endDateTime = $endDate ? Carbon::parse($endDate)->endOfDay()->setTimezone('UTC') : null;
        }


        return $this->getOrdersByStatus(Bill::STATUS_PENDING, $perPage, $startDateTime, $endDateTime, $phone, $paymentType, $promotionCode);
    }


    public function processedOrders(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $startTime = $request->input('start_time');
        $endTime = $request->input('end_time');
        $perPage = $request->input('per_page', 10);
        $phone = $request->input('phone');
        $paymentType = $request->input('payment_type');
        $promotionCode = $request->input('promotion_code');


        if ($startDate && $startTime) {
            $startDateTime = Carbon::parse("$startDate $startTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $startDateTime = $startDate ? Carbon::parse($startDate)->startOfDay()->setTimezone('UTC') : null;
        }

        if ($endDate && $endTime) {
            $endDateTime = Carbon::parse("$endDate $endTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $endDateTime = $endDate ? Carbon::parse($endDate)->endOfDay()->setTimezone('UTC') : null;
        }
        return $this->getOrdersByStatus(Bill::STATUS_PROCESSED, $perPage, $startDateTime, $endDateTime, $phone, $paymentType, $promotionCode);
    }

    public function shippedOrders(Request $request)
    {

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $startTime = $request->input('start_time');
        $endTime = $request->input('end_time');
        $perPage = $request->input('per_page', 10);
        $phone = $request->input('phone');
        $paymentType = $request->input('payment_type');
        $promotionCode = $request->input('promotion_code');


        if ($startDate && $startTime) {
            $startDateTime = Carbon::parse("$startDate $startTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $startDateTime = $startDate ? Carbon::parse($startDate)->startOfDay()->setTimezone('UTC') : null;
        }

        if ($endDate && $endTime) {
            $endDateTime = Carbon::parse("$endDate $endTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $endDateTime = $endDate ? Carbon::parse($endDate)->endOfDay()->setTimezone('UTC') : null;
        }
        return $this->getOrdersByStatus(Bill::STATUS_SHIPPED, $perPage, $startDateTime, $endDateTime, $phone, $paymentType, $promotionCode);
    }

    public function deliveredOrders(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $startTime = $request->input('start_time');
        $endTime = $request->input('end_time');
        $perPage = $request->input('per_page', 10);
        $phone = $request->input('phone');
        $paymentType = $request->input('payment_type');
        $promotionCode = $request->input('promotion_code');


        if ($startDate && $startTime) {
            $startDateTime = Carbon::parse("$startDate $startTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $startDateTime = $startDate ? Carbon::parse($startDate)->startOfDay()->setTimezone('UTC') : null;
        }

        if ($endDate && $endTime) {
            $endDateTime = Carbon::parse("$endDate $endTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $endDateTime = $endDate ? Carbon::parse($endDate)->endOfDay()->setTimezone('UTC') : null;
        }
        return $this->getOrdersByStatus(Bill::STATUS_DELIVERED, $perPage, $startDateTime, $endDateTime, $phone, $paymentType, $promotionCode);
    }

    public function canceledOrders(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $startTime = $request->input('start_time');
        $endTime = $request->input('end_time');
        $perPage = $request->input('per_page', 10);
        $phone = $request->input('phone');
        $paymentType = $request->input('payment_type');
        $promotionCode = $request->input('promotion_code');


        if ($startDate && $startTime) {
            $startDateTime = Carbon::parse("$startDate $startTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $startDateTime = $startDate ? Carbon::parse($startDate)->startOfDay()->setTimezone('UTC') : null;
        }

        if ($endDate && $endTime) {
            $endDateTime = Carbon::parse("$endDate $endTime", 'Asia/Ho_Chi_Minh')->setTimezone('UTC');
        } else {
            $endDateTime = $endDate ? Carbon::parse($endDate)->endOfDay()->setTimezone('UTC') : null;
        }
        return $this->getOrdersByStatus(Bill::STATUS_CANCELED, $perPage, $startDateTime, $endDateTime, $phone, $paymentType, $promotionCode);
    }




    private function getOrdersByStatus($status = null, $perPage = 10, $startDateTime = null, $endDateTime = null, $phone = null, $paymentType = null, $promotionCode = null)
    {
        $query = Bill::with([
            'shippingAddress:id,address_line,city,district,ward,phone_number',
            'BillDetail'
        ])->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status_bill', $status);
        }

        if ($startDateTime && $endDateTime) {
            $query->whereBetween('created_at', [$startDateTime, $endDateTime]);
        }

        if ($phone) {
            $query->whereHas('shippingAddress', function ($q) use ($phone) {
                $q->where('phone_number', 'LIKE', "%$phone%");
            });
        }

        if ($paymentType) {
            $query->where('payment_type', $paymentType);
        }

        if ($promotionCode) {
            $promotion = Promotion::where('code', $promotionCode)->first();
            if ($promotion) {
                // Sử dụng FIND_IN_SET để tìm ID khuyến mãi trong trường promotion_ids
                $query->whereRaw("FIND_IN_SET(?, promotion_ids)", [$promotion->id]);
            } else {
                // Nếu không tìm thấy mã khuyến mãi, trả về danh sách rỗng
                return response()->json(['bills' => [], 'pagination' => []], 200);
            }
        }

        $bills = $query->paginate($perPage);

        $bills->getCollection()->transform(function ($bill) {
            $bill->status_description = $bill->getTrangThaiDonHang();
            $bill->payment_type_description = $bill->getLoaiThanhToan();

            $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
            $bill->order_date = $dateTime->format('d/m/Y');
            $bill->order_time = $dateTime->format('H:i:s');

            $quantity = $bill->BillDetail->sum('quantity');

            return [
                'id' => $bill->id,
                'code_orders' => $bill->code_orders,
                'phone' => $bill->shippingAddress->phone_number,
                'order_date' => $bill->order_date,
                'order_time' => $bill->order_time,
                'status_bill' => $bill->status_bill,
                'status_description' => $bill->status_description,
                'payment_type' => $bill->payment_type,
                'payment_type_description' => $bill->payment_type_description,
                'total' => $bill->total,
                'quantity' => $quantity,
                'canceled_reason' => $bill->canceled_reason,
            ];
        });

        return response()->json([
            'bills' => $bills->items(),
            'pagination' => [
                'current_page' => $bills->currentPage(),
                'last_page' => $bills->lastPage(),
                'per_page' => $bills->perPage(),
                'total' => $bills->total(),
            ]
        ], 200);
    }












    public function searchOrder(Request $request)
    {
        $orderCode = $request->input('order_code');

        if (!$orderCode || strlen($orderCode) < 3) {
            return response()->json(['message' => 'Vui lòng nhập mã đơn hàng hợp lệ để tìm kiếm.'], 400);
        }

        // Tìm kiếm đơn hàng theo mã đơn hàng (không lọc theo trạng thái)
        $bill = Bill::with('BillDetail')
            ->where('code_orders', $orderCode)
            ->first();

        if (!$bill) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng với mã này.'], 404);
        }

        // Xử lý dữ liệu đơn hàng để trả về các thông tin cơ bản
        $bill->status_description = $bill->getTrangThaiDonHang();
        $bill->payment_type_description = $bill->getLoaiThanhToan();

        $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
        $bill->order_date = $dateTime->format('d/m/Y');
        $bill->order_time = $dateTime->format('H:i:s');

        $quantity = $bill->BillDetail->sum('quantity');

        // Chuẩn bị dữ liệu trả về
        $billData = [
            'id' => $bill->id,
            'code_orders' => $bill->code_orders,
            'order_date' => $bill->order_date,
            'order_time' => $bill->order_time,
            'status_bill' => $bill->status_bill,
            'status_description' => $bill->status_description,
            'payment_type' => $bill->payment_type,
            'payment_type_description' => $bill->payment_type_description,
            'total' => $bill->total,
            'quantity' => $quantity,
        ];

        return response()->json(['bill' => $billData], 200);
    }


    // Hàm tìm kiếm đơn hàng theo mã đơn hàng và trạng thái
    private function searchOrderByStatus(Request $request, $status = null)
    {
        $orderCode = $request->input('order_code');

        if (!$orderCode) {
            return response()->json(['message' => 'Vui lòng nhập mã đơn hàng để tìm kiếm.'], 400);
        }

        // Tìm kiếm đơn hàng theo mã đơn hàng và trạng thái
        $query = Bill::with('BillDetail')
            ->where('code_orders', $orderCode);

        if ($status) {
            $query->where('status_bill', $status);
        }

        $bill = $query->first();

        if (!$bill) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng với mã này.'], 404);
        }

        // Xử lý dữ liệu đơn hàng để trả về các thông tin cơ bản
        $bill->status_description = $bill->getTrangThaiDonHang();
        $bill->payment_type_description = $bill->getLoaiThanhToan();

        $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
        $bill->order_date = $dateTime->format('d/m/Y');
        $bill->order_time = $dateTime->format('H:i:s');

        $quantity = $bill->BillDetail->sum('quantity');

        // Chuẩn bị dữ liệu trả về
        $billData = [
            'id' => $bill->id,
            'code_orders' => $bill->code_orders,
            'order_date' => $bill->order_date,
            'order_time' => $bill->order_time,
            'status_bill' => $bill->status_bill,
            'status_description' => $bill->status_description,
            'payment_type' => $bill->payment_type,
            'payment_type_description' => $bill->payment_type_description,
            'total' => $bill->total,
            'quantity' => $quantity,
        ];

        return response()->json(['bill' => $billData], 200);
    }

    // Các hàm public để gọi tìm kiếm đơn hàng theo trạng thái
    public function searchPendingOrder(Request $request)
    {
        return $this->searchOrderByStatus($request, Bill::STATUS_PENDING);
    }

    public function searchProcessedOrder(Request $request)
    {
        return $this->searchOrderByStatus($request, Bill::STATUS_PROCESSED);
    }

    public function searchShippedOrder(Request $request)
    {
        return $this->searchOrderByStatus($request, Bill::STATUS_SHIPPED);
    }

    public function searchDeliveredOrder(Request $request)
    {
        return $this->searchOrderByStatus($request, Bill::STATUS_DELIVERED);
    }

    public function searchCanceledOrder(Request $request)
    {
        return $this->searchOrderByStatus($request, Bill::STATUS_CANCELED);
    }



    public function showDetailOrder($orderId)
    {
        try {
            // Lấy thông tin đơn hàng với các liên kết chi tiết
            $bill = Bill::with([
                'shippingAddress:id,full_name,address_line,city,district,ward,phone_number',
                'BillDetail.product:id,name,price',
                'BillDetail.productVariationValue:id,product_variation_id,attribute_value_id,sku,stock,price,discount',
                'BillDetail.productVariationValue.attributeValue:id,value',
                'BillDetail.productVariationValue.productVariation.variationImages' => function ($query) {
                    $query->select('product_variation_id', 'image_path'); // Lấy ảnh của biến thể
                },
                'payments'

            ])->findOrFail($orderId);

            // Xử lý dữ liệu đơn hàng để hiển thị chi tiết hơn
            $bill->status_description = $bill->getTrangThaiDonHang();
            $bill->payment_type_description = $bill->getLoaiThanhToan();

            // Chuyển đổi created_at sang múi giờ Việt Nam và tách thành ngày và giờ
            $dateTime = Carbon::parse($bill->created_at)->timezone('Asia/Ho_Chi_Minh');
            $bill->order_date = $dateTime->format('d/m/Y'); // Chỉ ngày
            $bill->order_time = $dateTime->format('H:i:s'); // Chỉ giờ

            // Đưa các trường từ shippingAddress lên cấp trên
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

            // Lấy thông tin từ bảng promotions
            $promotionIds = !empty($bill->promotion_ids) ? explode(',', $bill->promotion_ids) : [];
            $promotions = Promotion::whereIn('id', $promotionIds)->get(['code', 'discount_amount', 'description']);

            // Thêm thông tin khuyến mãi vào kết quả trả về
            $bill->promotions = $promotions;

            // Đưa thông tin từ product và productVariationValue lên cùng cấp trong mỗi BillDetail và sắp xếp lại các trường
            $bill->BillDetail->transform(function ($detail) {
                $detail->name = $detail->product->name ?? null;
                $detail->price = $detail->product->price ?? null;
                $detail->sku = $detail->productVariationValue->sku ?? null;
                $detail->discount = $detail->productVariationValue->discount ?? null;
                $detail->attribute_value = $detail->productVariationValue->attributeValue->value ?? null;
                $detail->attribute_value_name = $detail->productVariationValue->productVariation->attributeValue->value ?? null;

                // Lấy hình ảnh từ ProductVariation nếu có
                $detail->variation_images = $detail->productVariationValue->productVariation->variationImages->pluck('image_path') ?? [];

                // Xóa các thuộc tính không cần thiết
                unset($detail->product);
                unset($detail->productVariationValue);
                unset($detail->created_at);
                unset($detail->updated_at);

                // Re-order the fields
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


            // Lấy thông tin payment nếu có
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

            // Re-order the fields for bill
            return response()->json([
                'id' => $bill->id,
                'code_orders' => $bill->code_orders,
                'user_id' => $bill->user_id,
                'name' => $bill->user->name,
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
                'email_receiver' => $bill->email_receiver,
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


    public function updateOrderStatus(Request $request, $orderId)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|in:pending,processed,shipped,delivered,canceled,returned',
        ]);

        $newStatus = $validatedData['status'];

        try {
            $bill = Bill::findOrFail($orderId);
            $currentStatus = $bill->status_bill;

            if ($currentStatus === $newStatus) {
                $currentStatusDescription = $this->getStatusMessage($currentStatus);
                return response()->json([
                    'message' => "Đơn hàng đã ở trạng thái '{$currentStatusDescription}', không thể cập nhật lại cùng trạng thái."
                ], 400);
            }

            if ($this->canUpdateStatus($currentStatus, $newStatus)) {
                if ($newStatus === Bill::STATUS_CANCELED) {
                    foreach ($bill->BillDetail as $detail) {
                        $variationValue = $detail->productVariationValue;

                        $variationValue->increment('stock', $detail->quantity);

                        $variationValue->productVariation->increment('stock', $detail->quantity);
                        $detail->product->increment('stock', $detail->quantity);
                    }
                }

                $bill->update(['status_bill' => $newStatus]);

                $message = $this->getStatusMessage($newStatus);

                return response()->json(['message' => $message, 'status' => $newStatus], 200);
            } else {
                // Thêm thông báo chi tiết về trạng thái hiện tại và trạng thái muốn chuyển sang
                $currentStatusDescription = $this->getStatusMessage($currentStatus);
                $newStatusDescription = $this->getStatusMessage($newStatus);

                return response()->json([
                    'message' => "Không thể chuyển đổi từ trạng thái '{$currentStatusDescription}' sang trạng thái '{$newStatusDescription}'."
                ], 400);
            }
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.', 'error' => $e->getMessage()], 500);
        }
    }



    private function canUpdateStatus($currentStatus, $newStatus)
    {
        $allowedTransitions = [
            Bill::STATUS_PENDING => [Bill::STATUS_PROCESSED, Bill::STATUS_CANCELED],
            Bill::STATUS_PROCESSED => [Bill::STATUS_SHIPPED],
            Bill::STATUS_SHIPPED => [Bill::STATUS_DELIVERED],
            Bill::STATUS_DELIVERED => [],
            Bill::STATUS_CANCELED => [],
            Bill::STATUS_RETURNED => [],
        ];

        return in_array($newStatus, $allowedTransitions[$currentStatus] ?? []);
    }

    private function getStatusMessage($status)
    {
        // Mảng thông báo trạng thái
        $statusMessages = [
            Bill::STATUS_PENDING => 'Đơn hàng đang chờ xử lý.',
            Bill::STATUS_PROCESSED => 'Đơn hàng đã được xử lý.',
            Bill::STATUS_SHIPPED => 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.',
            Bill::STATUS_DELIVERED => 'Đơn hàng đã được giao',
            Bill::STATUS_CANCELED => 'Đơn hàng đã bị hủy.',
            Bill::STATUS_RETURNED => 'Đơn hàng đã bị hủy và trả lại.',
        ];

        return $statusMessages[$status] ?? 'Trạng thái đơn hàng đã được cập nhật.';
    }
}
