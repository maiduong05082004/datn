<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    use HasFactory;

    // Các hằng số trạng thái vận chuyển
    const STATUS_PENDING = 'pending';
    const STATUS_RECEIVED_FROM_SELLER = 'received_from_seller';
    const STATUS_IN_TRANSIT = 'in_transit';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELED = 'canceled';

    // Các trường có thể điền hàng loạt (fillable)
    protected $fillable = [
        'bill_id',
        'method',
        'provider',
        'tracking_number',
        'shipping_fee',
        'status',
        'estimated_delivery_date',
        'actual_delivery_date',
    ];

    // Quan hệ với bảng bills
    public function bill()
    {
        return $this->belongsTo(Bill::class, 'bill_id');
    }

    // Các phương thức tiện ích để kiểm tra trạng thái vận chuyển
    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isReceivedFromSeller()
    {
        return $this->status === self::STATUS_RECEIVED_FROM_SELLER;
    }

    public function isInTransit()
    {
        return $this->status === self::STATUS_IN_TRANSIT;
    }

    public function isDelivered()
    {
        return $this->status === self::STATUS_DELIVERED;
    }

    public function isCanceled()
    {
        return $this->status === self::STATUS_CANCELED;
    }

    // Phương thức tiện ích để lấy mô tả trạng thái vận chuyển bằng tiếng Việt
    public function getTrangThaiVanChuyen()
    {
        $statuses = [
            self::STATUS_PENDING => 'Đang chờ xử lý',
            self::STATUS_RECEIVED_FROM_SELLER => 'Đã nhận từ người bán',
            self::STATUS_IN_TRANSIT => 'Đang vận chuyển',
            self::STATUS_DELIVERED => 'Đã giao hàng',
            self::STATUS_CANCELED => 'Đã hủy',
        ];

        return $statuses[$this->status] ?? 'Không xác định';
    }
}
