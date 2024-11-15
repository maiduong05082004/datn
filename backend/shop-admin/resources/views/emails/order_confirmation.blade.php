<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #ddd;
        }
        .header h1 {
            color: #d5232a;
            font-size: 24px;
            margin: 0;
            padding: 10px 0;
        }
        .content {
            padding: 20px;
            color: #333;
            font-size: 14px;
        }
        .content p {
            margin: 10px 0;
        }
        .order-info,
        .shipping-info,
        .order-details {
            margin-top: 20px;
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin: 0 0 10px;
        }
        .order-info table,
        .shipping-info table,
        .order-details table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .order-info table td,
        .shipping-info table td,
        .order-details table th,
        .order-details table td {
            padding: 8px;
            border: 1px solid #ddd;
            font-size: 14px;
            text-align: left;
        }
        .order-details th {
            background-color: #f1f1f1;
            font-weight: bold;
        }
        .order-details img {
            width: 50px;
            height: auto;
        }
        .order-summary {
            text-align: right;
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
        }
        .strikethrough {
            color: #777;
            text-decoration: line-through;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <!-- Thêm logo vào đây -->
        <h1>XÁC NHẬN ĐƠN HÀNG</h1>
    </div>

    <div class="content">
        <p>Xin chào quý khách {{ $customerName }},</p>
        <p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
        <p>Mã đơn hàng của bạn là: <strong>{{ $orderId }}</strong></p>

        <div class="order-info">
            <h3 class="section-title">THÔNG TIN MUA HÀNG</h3>
            <table>
                <tr>
                    <td><strong>Mã đơn hàng:</strong></td>
                    <td>{{ $orderId }}</td>
                </tr>
                <tr>
                    <td><strong>Thời gian đặt hàng:</strong></td>
                    <td>{{ $orderDate }}</td>
                </tr>
                <tr>
                    <td><strong>Phương thức thanh toán:</strong></td>
                    <td>{{ $paymentType }}</td>
                </tr>
            </table>
        </div>

        <div class="shipping-info">
            <h3 class="section-title">ĐỊA CHỈ GIAO HÀNG</h3>
            <table>
                <tr>
                    <td><strong>Người nhận:</strong></td>
                    <td>{{ $customerName }}</td>
                </tr>
                <tr>
                    <td><strong>Địa chỉ:</strong></td>
                    <td>{{ $shippingAddress }}</td>
                </tr>
                <tr>
                    <td><strong>Số điện thoại:</strong></td>
                    <td>{{ $phoneNumber }}</td>
                </tr>
            </table>
        </div>

        <div class="order-details">
            <h3 class="section-title">CHI TIẾT ĐƠN HÀNG</h3>
            <table>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Màu sắc</th>
                    <th>Kích thước</th>
                    <th>Đơn giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                </tr>
                @foreach ($orderItems as $item)
                    <tr>
                        <td>
                            @if($item['image'])
                                <img src="{{ $item['image'] }}" alt="Ảnh sản phẩm">
                            @else
                                Không có ảnh
                            @endif
                        </td>
                        <td>{{ $item['productName'] }}</td>
                        <td>{{ $item['color'] }}</td>
                        <td>{{ $item['size'] }}</td>
                        <td>{{ number_format($item['unitPrice'], 0, ',', '.') }} VNĐ</td>
                        <td>{{ $item['quantity'] }}</td>
                        <td>{{ number_format($item['total'], 0, ',', '.') }} VNĐ</td>
                    </tr>
                @endforeach
            </table>
            <p class="order-summary">Phí vận chuyển: {{ number_format($shipping_fee, 0, ',', '.') }} VNĐ</p>
            <p class="order-summary">Phiếu Giảm giá phí vận chuyển của Beestyle: <span class="strikethrough">{{ number_format($discounted_amount, 0, ',', '.') }} VNĐ</span></p>
            <p class="order-summary">Phiếu Giảm giá voucher của Beestyle: <span class="strikethrough">{{ number_format($discounted_shipping_fee, 0, ',', '.') }} VNĐ</span></p>
            <p class="order-summary">Tổng giá trị đơn hàng: {{ number_format($totalAmount, 0, ',', '.') }} VNĐ</p>
        </div>
        
        <p>Chúng tôi sẽ sớm giao hàng đến địa chỉ của bạn.</p>
        <p>Xin chân thành cảm ơn!</p>
    </div>

    <div class="footer">
        <p>&copy; 2024 Cửa hàng của chúng tôi. Mọi quyền được bảo lưu.</p>
    </div>
</div>
</body>
</html>