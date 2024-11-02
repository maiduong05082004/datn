<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Carbon\Carbon;
use Illuminate\Http\Request;

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

        if (!$orderCode) {
            return response()->json(['message' => 'Vui lòng nhập mã đơn hàng để tìm kiếm.'], 400);
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
}
