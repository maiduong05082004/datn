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
        return $this->getOrdersByStatus(null, $request->input('per_page', 10));
    }

    public function pendingOrders(Request $request)
    {
        return $this->getOrdersByStatus(Bill::STATUS_PENDING, $request->input('per_page', 10));
    }

    public function processedOrders(Request $request)
    {
        return $this->getOrdersByStatus(Bill::STATUS_PROCESSED, $request->input('per_page', 10));
    }

    public function shippedOrders(Request $request)
    {
        return $this->getOrdersByStatus(Bill::STATUS_SHIPPED, $request->input('per_page', 10));
    }

    public function deliveredOrders(Request $request)
    {
        return $this->getOrdersByStatus(Bill::STATUS_DELIVERED, $request->input('per_page', 10));
    }

    public function canceledOrders(Request $request)
    {
        return $this->getOrdersByStatus(Bill::STATUS_CANCELED, $request->input('per_page', 10));
    }


    private function getOrdersByStatus($status = null, $perPage = 10)
    {
        $query = Bill::with([
            'shippingAddress:id,address_line,city,district,ward,phone_number',
            'BillDetail'
        ])
        ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status_bill', $status);
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
                }
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
                    'variation_images' => $detail->variation_images,
                ];
            });

            // Re-order the fields for bill
            return response()->json([
                'id' => $bill->id,
                'code_orders' => $bill->code_orders,
                'user_id' => $bill->user_id,
                'name' => $bill->user->name,
                'note' => $bill->note,
                'payment_type' => $bill->payment_type,
                'payment_type_description' => $bill->payment_type_description,
                'status_bill' => $bill->status_bill,
                'status_description' => $bill->status_description,
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
    
            // Kiểm tra nếu trạng thái mới giống với trạng thái hiện tại
            if ($currentStatus === $newStatus) {
                $currentStatusDescription = $this->getStatusMessage($currentStatus);
                return response()->json([
                    'message' => "Đơn hàng đã ở trạng thái '{$currentStatusDescription}', không thể cập nhật lại cùng trạng thái."
                ], 400);
            }
    
            // Kiểm tra xem trạng thái hiện tại có thể chuyển sang trạng thái mới không
            if ($this->canUpdateStatus($currentStatus, $newStatus)) {
                $bill->update(['status_bill' => $newStatus]);
    
                // Lấy thông báo trạng thái từ hàm `getStatusMessage`
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
            Bill::STATUS_PROCESSED => [Bill::STATUS_SHIPPED, Bill::STATUS_CANCELED],
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
