<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    // Các trạng thái thanh toán
    const STATUS_PENDING = 'pending';    // Chưa thanh toán
    const STATUS_PAID = 'paid';          // Đã thanh toán
    const STATUS_REFUNDED = 'refunded';  // Đã hoàn tiền
    const STATUS_FAILED = 'failed';      // Thất bại

    // Các phương thức thanh toán (chỉ online)
    const METHOD_VNPAY = 'VNPAY';
    const METHOD_MOMO = 'MOMO';

    // Các trường có thể điền hàng loạt (fillable)
    protected $fillable = [
        'bill_id',         // Liên kết với hóa đơn
        'user_id',         // Liên kết với người dùng
        'payment_method',  // Phương thức thanh toán (VNPAY, MOMO)
        'amount',          // Số tiền thanh toán
        'status',          // Trạng thái thanh toán
        'transaction_id',  // Mã giao dịch từ cổng thanh toán
        'bank_code',       // Mã ngân hàng (chỉ áp dụng cho VNPAY)
        'card_type',       // Loại thẻ thanh toán (chỉ áp dụng cho VNPAY)
        'order_info',      // Thông tin đơn hàng
        'pay_type',        // Loại thanh toán (chỉ áp dụng cho MOMO)
        'pay_date',        // Ngày thanh toán
        'canceled_reason', // Lý do hủy thanh toán (nếu có)
    ];

    // Quan hệ với bảng bills (hóa đơn)
    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    // Quan hệ với bảng users (người thực hiện thanh toán)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Các phương thức tiện ích để kiểm tra trạng thái thanh toán
    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isPaid()
    {
        return $this->status === self::STATUS_PAID;
    }

    public function isRefunded()
    {
        return $this->status === self::STATUS_REFUNDED;
    }

    public function isFailed()
    {
        return $this->status === self::STATUS_FAILED;
    }

    // Phương thức tiện ích để kiểm tra phương thức thanh toán
    public function isVnpay()
    {
        return $this->payment_method === self::METHOD_VNPAY;
    }

    public function isMomo()
    {
        return $this->payment_method === self::METHOD_MOMO;
    }

    // Phương thức tiện ích để lấy mô tả trạng thái thanh toán
    public function getPaymentStatus()
    {
        $statuses = [
            self::STATUS_PENDING => 'Chưa thanh toán',
            self::STATUS_PAID => 'Đã thanh toán',
            self::STATUS_REFUNDED => 'Đã hoàn tiền',
            self::STATUS_FAILED => 'Thanh toán thất bại',
        ];

        return $statuses[$this->status] ?? 'Không xác định';
    }

    // Phương thức tiện ích để lấy mô tả phương thức thanh toán
    public function getPaymentMethod()
    {
        $methods = [
            self::METHOD_VNPAY => 'Thanh toán qua VNPAY',
            self::METHOD_MOMO => 'Thanh toán qua MOMO',
        ];

        return $methods[$this->payment_method] ?? 'Không xác định';
    }
}
