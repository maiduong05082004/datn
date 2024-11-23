<?php 

namespace App\Http\Controllers\Api\Admin\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Bill;
use App\Models\ShippingAddress;

class ShippingController extends Controller
{
    private $ghnToken;
    private $ghnShopId;

    public function __construct()
    {
        $this->ghnToken = '4bd9602e-9ad5-11ef-8e53-0a00184fe694';
        $this->ghnShopId = '195219';
    }



    
public function createGHNOrderFromBill($billId)
{
    // Kiểm tra nếu đơn hàng đã có mã `order_code_shipping`
    $bill = Bill::findOrFail($billId);
    if (!empty($bill->order_code_shipping)) {
        return response()->json([
            'success' => false,
            'message' => 'Đơn hàng này đã được tạo trên GHN trước đó. Vui lòng kiểm tra lại.'
        ], 400);
    }

    // Lấy thông tin từ bảng shipping_addresses
    $shippingAddress = ShippingAddress::findOrFail($bill->shipping_address_id);

    // Chuẩn bị dữ liệu JSON để gửi tới GHN API
    $data = $this->prepareGHNOrderData($bill, $shippingAddress);

    $url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create';

    // Gửi request đến API GHN
    $response = Http::withHeaders([
        'Token' => $this->ghnToken,
        'ShopId' => $this->ghnShopId,
        'Content-Type' => 'application/json',
    ])->post($url, $data);

    // Kiểm tra và trả về phản hồi
    if ($response->successful()) {
        $data = $response->json();
        // Lưu mã order_code từ GHN vào trường order_code_shipping trong bảng bills
        $bill->order_code_shipping = $data['data']['order_code'] ?? null;

        // Cập nhật trạng thái của đơn hàng thành "shipped"
        $bill->status_bill = 'shipped'; // hoặc giá trị hằng số tương ứng nếu có, ví dụ: Bill::STATUS_SHIPPED
        $bill->save();

        return response()->json([
            'success' => true,
            'order_data' => $data['data'] ?? null,
        ]);
    } else {
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi gọi API GHN',
            'error' => $response->json() ?? 'Unknown error'
        ], $response->status());
    }
}



    private function prepareGHNOrderData($bill, $shippingAddress)
    {
        $items = [];
        
        foreach ($bill->BillDetail as $billDetail) {
            $productName = $billDetail->product ? $billDetail->product->name : 'Default Product Name';
            $productCategoryName = $billDetail->product->category ? $billDetail->product->category->name : 'Default category Name';
            $productCode = $billDetail->productVariationValue ? $billDetail->productVariationValue->sku : 'Default Product Code';
            $quantity = $billDetail->quantity;
            $price = $billDetail->total_amount;
    
            $items[] = [
                'name' => $productName,
                'code' => $productCode,
                'quantity' => $quantity,
                'price' => (int) $price,
                'length' => 12,
                'width' => 12,
                'height' => 12,
                'weight' => 1200,
                'category' => [
                    'level1' => $productCategoryName
                ]
            ];
        }
    
        return [
            'payment_type_id' => $bill->payment_type == 'cod' ? 2 : 1,
            'note' => $bill->note,
            'required_note' => 'KHONGCHOXEMHANG',
            'from_name' => 'Beestyle',
            'from_phone' => '0987654321',
            'from_address' => '12 Láng Hạ, Phường Láng Hạ, Quận Đống Đa, Hà Nội',
            'from_ward_name' => 'Láng Hạ',
            'from_district_name' => 'Đống Đa',
            'from_province_name' => 'Hà Nội',
            'to_name' => $shippingAddress->full_name ?? 'Default Receiver',
            'to_phone' => $shippingAddress->phone_number ?? '0000000000',
            'to_address' => $shippingAddress->address_line ?? 'Default Address',
            'to_ward_code' => $shippingAddress->ward ?? 'Default Ward',
            'to_district_id' => $shippingAddress->district ?? 1,
            'cod_amount' => (int) ($bill->total - ($bill->discounted_amount ?? 0) - ($bill->discounted_shipping_fee ?? 0)),
            'weight' => 200,
            'length' => 1,
            'width' => 19,
            'height' => 10,
            'pick_station_id' => 1444,
            'deliver_station_id' => null,
            'insurance_value' => (int) $bill->subtotal,
            'service_id' => 53321, // Thêm service_id chính xác vào đây
            'service_type_id' => 2, // Thêm service_type_id chính xác vào đây
            'coupon' => null,
            'pick_shift' => [2],
            'items' => $items 
        ];
    }
    
    public function getGHNOrderDetail($billId)
    {
        // Lấy mã order_code_shipping từ bảng bills
        $bill = Bill::findOrFail($billId);
    
        if (empty($bill->order_code_shipping)) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy mã đơn hàng GHN (order_code_shipping) trong bảng bills.'
            ], 400);
        }
    
        $orderCode = $bill->order_code_shipping;
    
        $url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail';
    
        // Cấu trúc dữ liệu để gửi tới API GHN
        $data = [
            'order_code' => $orderCode
        ];
    
        // Gửi request POST đến API GHN
        $response = Http::withHeaders([
            'Token' => $this->ghnToken,
            'Content-Type' => 'application/json',
        ])->post($url, $data);
    
        // Kiểm tra và trả về phản hồi
        if ($response->successful()) {
            $data = $response->json();
            return response()->json([
                'success' => true,
                'order_detail' => $data['data'] ?? null,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết đơn hàng từ GHN',
                'error' => $response->json() ?? 'Unknown error'
            ], $response->status());
        }
    }
    

    

    public function cancelGHNOrder($billId)
    {
        $bill = Bill::findOrFail($billId);
    
        if (empty($bill->order_code_shipping)) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy mã đơn hàng từ GHN để hủy.'
            ], 400);
        }
    
        $urlDetail = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail';
        $detailResponse = Http::withHeaders([
            'Token' => $this->ghnToken,
            'Content-Type' => 'application/json',
        ])->post($urlDetail, [
            'order_code' => $bill->order_code_shipping
        ]);
    
        // Kiểm tra phản hồi của API để đảm bảo đơn hàng ở trạng thái 'ready_to_pick'
        if ($detailResponse->successful()) {
            $orderDetail = $detailResponse->json();
            $status = $orderDetail['data']['status'] ?? null; // Lấy giá trị của trường status
    
            if ($status !== 'ready_to_pick') {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không được phép hủy đơn hàng khi trạng thái không phải là ready_to_pick.'
                ], 403);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin đơn hàng từ GHN.',
                'error' => $detailResponse->json() ?? 'Unknown error'
            ], $detailResponse->status());
        }
    
        // Nếu trạng thái là 'ready_to_pick', tiến hành hủy đơn hàng
        $urlCancel = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel';
        $data = [
            'order_codes' => [$bill->order_code_shipping]
        ];
    
        $cancelResponse = Http::withHeaders([
            'Token' => $this->ghnToken,
            'ShopId' => $this->ghnShopId,
            'Content-Type' => 'application/json',
        ])->post($urlCancel, $data);
    
        if ($cancelResponse->successful()) {
            $data = $cancelResponse->json();
            
            // Cập nhật trạng thái đơn hàng và đặt order_code_shipping về null sau khi hủy thành công
            $bill->status_bill = Bill::STATUS_CANCELED;
            $bill->order_code_shipping = null;
            $bill->save();
    
            return response()->json([
                'success' => true,
                'message' => 'Đơn hàng đã được hủy thành công',
                'data' => $data['data'] ?? null,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi hủy đơn hàng trên GHN',
                'error' => $cancelResponse->json() ?? 'Unknown error'
            ], $cancelResponse->status());
        }
    }
    


    public function updateGHNOrder(Request $request, $billId)
    {
        // Lấy thông tin bill và kiểm tra order_code_shipping đã tồn tại chưa
        $bill = Bill::findOrFail($billId);
        if (empty($bill->order_code_shipping)) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy mã đơn hàng GHN (order_code_shipping) trong bảng bills.'
            ], 400);
        }

        // Chuẩn bị dữ liệu cập nhật
        $shippingAddress = ShippingAddress::findOrFail($bill->shipping_address_id);
        $data = $this->prepareGHNOrderData($bill, $shippingAddress);
        $data['order_code'] = $bill->order_code_shipping;  // Thêm order_code để GHN nhận diện đơn hàng cần cập nhật

        $url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/update';

        // Gửi yêu cầu cập nhật đơn hàng
        $response = Http::withHeaders([
            'Token' => $this->ghnToken,
            'ShopId' => $this->ghnShopId,
            'Content-Type' => 'application/json',
        ])->post($url, $data);

        if ($response->successful()) {
            $data = $response->json();
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật đơn hàng thành công',
                'data' => $data['data'] ?? null,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật đơn hàng trên GHN',
                'error' => $response->json() ?? 'Unknown error'
            ], $response->status());
        }
    }





}
