<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    // Các hằng số cho trạng thái của đơn hàng
    const STATUS_PENDING = 'pending'; // đang xử lý
    const STATUS_PROCESSED = 'processed'; // đã xử lý (Mục đích ko thể hủy đơn hàng)
    const STATUS_SHIPPED = 'shipped'; // ship đang giao
    const STATUS_DELIVERED = 'delivered'; // đã giao nhận
    const STATUS_CANCELED = 'canceled'; // Đã hủy
    const STATUS_RETURNED = 'returned'; // trả hàng

    // Các hằng số cho loại thanh toán
    const PAYMENT_TYPE_ONLINE = 'online';
    const PAYMENT_TYPE_COD = 'cod';

    // Các trường có thể điền hàng loạt (fillable)
    protected $fillable = [
        'code_orders',
        'user_id',
        'email_receiver',
        'note',
        'status_bill',
        'subtotal',
        'total',
        'canceled_at',
        'canceled_reason',
        'promotion_ids',
        'payment_type',
        'shipping_address_id',
        'order_code_shipping',
        'shipping_fee',
        'discounted_amount',
        'discounted_shipping_fee'
    ];

    // Quan hệ với bảng users
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với bảng Bill_detail (BillDetail)
    public function BillDetail()
    {
        return $this->hasMany(BillDetail::class);
    }



    // Quan hệ với bảng payments để quản lý các giao dịch thanh toán
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Quan hệ với bảng ShippingAddress
    public function shippingAddress()
    {
        return $this->belongsTo(ShippingAddress::class, 'shipping_address_id');
    }

    // Các phương thức tiện ích để kiểm tra trạng thái đơn hàng
    public function isPending()
    {
        return $this->status_bill === self::STATUS_PENDING;
    }

    public function isProcessed()
    {
        return $this->status_bill === self::STATUS_PROCESSED;
    }

    public function isShipped()
    {
        return $this->status_bill === self::STATUS_SHIPPED;
    }

    public function isDelivered()
    {
        return $this->status_bill === self::STATUS_DELIVERED;
    }

    public function isCanceled()
    {
        return $this->status_bill === self::STATUS_CANCELED;
    }

    public function isReturned()
    {
        return $this->status_bill === self::STATUS_RETURNED;
    }

    // Phương thức tiện ích để lấy mô tả trạng thái đơn hàng bằng tiếng Việt
    public function getTrangThaiDonHang()
    {
        $statuses = [
            self::STATUS_PENDING => 'Đang chờ xử lý',
            self::STATUS_PROCESSED => 'Đã xử lý',
            self::STATUS_SHIPPED => 'Đã giao hàng',
            self::STATUS_DELIVERED => 'Đã giao hàng',
            self::STATUS_CANCELED => 'Đã hủy đơn hàng',
            self::STATUS_RETURNED => 'Hủy đơn và trả hàng',
        ];

        return $statuses[$this->status_bill] ?? 'Không xác định';
    }

    // Các phương thức tiện ích để kiểm tra loại thanh toán
    public function isOnlinePayment()
    {
        return $this->payment_type === self::PAYMENT_TYPE_ONLINE;
    }

    public function isCodPayment()
    {
        return $this->payment_type === self::PAYMENT_TYPE_COD;
    }

    // Phương thức tiện ích để lấy mô tả loại thanh toán
    public function getLoaiThanhToan()
    {
        $paymentTypes = [
            self::PAYMENT_TYPE_ONLINE => 'Thanh toán Online',
            self::PAYMENT_TYPE_COD => 'Thanh toán khi nhận hàng (COD)',
        ];

        return $paymentTypes[$this->payment_type] ?? 'Không xác định';
    }
}
