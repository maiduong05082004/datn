<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    // Các hằng số trạng thái khuyến mãi
    const STATUS_ACTIVE = 'active';
    const STATUS_EXPIRED = 'expired';
    const STATUS_UPCOMING = 'upcoming';
    const STATUS_DISABLED = 'disabled';

    // Các trường có thể điền hàng loạt (fillable)
    protected $fillable = [
        'code',
        'description',
        'start_date',
        'end_date',
        'discount_amount',
        'usage_limit',
        'min_order_value',
        'promotion_type',
        'is_active',
        'category_id',
        'product_id',
        'status',
    ];

    // Quan hệ với bảng users (thông qua bảng trung gian user_promotions)
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_promotions');
    }

    // Quan hệ với bảng bills
    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    // Các phương thức tiện ích để kiểm tra trạng thái khuyến mãi
    public function isActive()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isExpired()
    {
        return $this->status === self::STATUS_EXPIRED;
    }

    public function isUpcoming()
    {
        return $this->status === self::STATUS_UPCOMING;
    }

    public function isDisabled()
    {
        return $this->status === self::STATUS_DISABLED;
    }

    // Phương thức tiện ích để lấy mô tả trạng thái khuyến mãi bằng tiếng Việt
    public function getTrangThaiKhuyenMai()
    {
        $statuses = [
            self::STATUS_ACTIVE => 'Đang diễn ra',
            self::STATUS_EXPIRED => 'Đã kết thúc',
            self::STATUS_UPCOMING => 'Sắp diễn ra',
            self::STATUS_DISABLED => 'Đã bị vô hiệu hóa',
        ];

        return $statuses[$this->status] ?? 'Không xác định';
    }
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function userPromotions()
    {
        return $this->hasMany(UserPromotion::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
