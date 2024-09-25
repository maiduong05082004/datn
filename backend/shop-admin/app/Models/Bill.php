<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    // Các hằng số cho trạng thái của đơn hàng
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSED = 'processed';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELED = 'canceled';
    const STATUS_RETURNED = 'returned'; // Trạng thái hủy đơn và trả hàng

    // Các hằng số cho loại thanh toán
    const PAYMENT_TYPE_ONLINE = 'online';
    const PAYMENT_TYPE_COD = 'cod';

    // Các trường có thể điền hàng loạt (fillable)
    protected $fillable = [
        'code_orders',
        'name_receiver',
        'user_id',
        'email_receiver',
        'phone_receiver',
        'Address',
        'note',
        'status_bill',
        'subtotal',
        'total',
        'promotion_id',
        'canceled_at',
        'canceled_reason',
        'payment_type', // Thêm cột payment_type
    ];

    // Quan hệ với bảng users
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với bảng bill_dentail (BillDentail)
    public function billDentail()
    {
        return $this->hasMany(BillDentail::class);
    }

    // Quan hệ với bảng promotions
    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }

    // Quan hệ với bảng vnpays (hoặc các phương thức thanh toán khác)
  

    // Quan hệ với bảng payments để quản lý các giao dịch thanh toán
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Quan hệ với bảng shipping (vận chuyển)
    public function shipping()
    {
        return $this->hasOne(Shipping::class, 'bill_id');
    }


      // Mối quan hệ với bảng ShippingAddress
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
            self::STATUS_SHIPPED => 'Đang bàn giao cho vận chuyển',
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
