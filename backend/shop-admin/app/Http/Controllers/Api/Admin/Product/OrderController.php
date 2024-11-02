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
        // Gọi hàm chung với tất cả các trạng thái đơn hàng
        return $this->getOrdersByStatus(null, $request->input('per_page', 10));
    }

    public function pendingOrders(Request $request)
    {
        // Gọi hàm chung với trạng thái 'pending'
        return $this->getOrdersByStatus(Bill::STATUS_PENDING, $request->input('per_page', 10));
    }

    public function processedOrders(Request $request)
    {
        // Gọi hàm chung với trạng thái 'processed'
        return $this->getOrdersByStatus(Bill::STATUS_PROCESSED, $request->input('per_page', 10));
    }

    public function shippedOrders(Request $request)
    {
        // Gọi hàm chung với trạng thái 'shipped'
        return $this->getOrdersByStatus(Bill::STATUS_SHIPPED, $request->input('per_page', 10));
    }

    public function deliveredOrders(Request $request)
    {
        // Gọi hàm chung với trạng thái 'delivered'
        return $this->getOrdersByStatus(Bill::STATUS_DELIVERED, $request->input('per_page', 10));
    }

    public function canceledOrders(Request $request)
    {
        // Gọi hàm chung với trạng thái 'canceled'
        return $this->getOrdersByStatus(Bill::STATUS_CANCELED, $request->input('per_page', 10));
    }

    private function getOrdersByStatus($status = null, $perPage = 10)
    {
        $query = Bill::with([
            'shippingAddress:id,address_line,city,district,ward,phone_number',
            'BillDetail'
        ])
        ->orderBy('created_at', 'desc');

        // Nếu có trạng thái được truyền vào, thêm điều kiện lọc
        if ($status) {
            $query->where('status_bill', $status);
        }

        $bills = $query->paginate($perPage);

        // Xử lý dữ liệu cho từng đơn hàng
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
}
