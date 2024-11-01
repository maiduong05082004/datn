<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
</head>
<body>
    <h1>Xin chào {{ $customerName }}</h1>
    <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</p>
    <p>Mã đơn hàng của bạn là: <strong>{{ $orderId }}</strong></p>
    <p>Tổng số tiền: <strong>{{ number_format($totalAmount, 0, ',', '.') }} VNĐ</strong></p>
    <p>Chúng tôi sẽ sớm giao hàng đến địa chỉ của bạn.</p>
    <p>Xin chân thành cảm ơn!</p>
</body>
</html>
