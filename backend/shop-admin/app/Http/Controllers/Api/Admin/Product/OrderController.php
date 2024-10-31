<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Promotion;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Lấy số lượng bản ghi mỗi trang từ frontend, mặc định là 10 nếu không có
        $perPage = $request->input('per_page', 10);
    
        $bills = Bill::with([
            'shippingAddress:id,address_line,city,district,ward,phone_number',
            'BillDetail'
        ])
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);  // Sử dụng $perPage từ request
    
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
    

    public function pendingOrders(Request $request)
    {
        $perPage = $request->get('per_page', 10); // Mặc định là 10 nếu không có 'per_page' từ frontend
    
        $bills = Bill::with([
            'shippingAddress:id,address_line,city,district,ward,phone_number',
            'BillDetail'
        ])
            ->where('status_bill', Bill::STATUS_PENDING)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    
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
    
    public function shippedOrders(Request $request)
    {
        $perPage = $request->get('per_page', 10); // Mặc định là 10 nếu không có 'per_page' từ frontend
    
        $bills = Bill::with([
            'shippingAddress:id,address_line,city,district,ward,phone_number',
            'BillDetail'
        ])
            ->where('status_bill', Bill::STATUS_SHIPPED)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    
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
