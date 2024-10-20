<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model
{
    // Tên bảng trong database (nếu không theo chuẩn 'shipping_addresses')
    protected $table = 'shipping_addresses';

    // Các trường có thể được gán giá trị thông qua mass assignment
    protected $fillable = [
        'user_id',          
        'address_line',     // Địa chỉ chi tiết (ví dụ: số nhà, tên đường)
        'city',             // Thành phố hoặc tỉnh
        'district',         // Quận hoặc huyện
        'ward',             // Phường hoặc xã
        'phone_number',     // Số điện thoại người nhận hàng
        'is_default'        // Cờ đánh dấu địa chỉ mặc định (true/false)
    ];

    // Mối quan hệ với bảng User (người dùng)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Mối quan hệ với bảng Bill
    public function bills()
    {
        return $this->hasMany(Bill::class, 'shipping_address_id');
    }

    // Lấy địa chỉ mặc định của người dùng
    public static function getDefaultAddress($userId)
    {
        return self::where('user_id', $userId)->where('is_default', true)->first();
    }

    // Đảm bảo mỗi người dùng chỉ có một địa chỉ mặc định
    public function setAsDefault()
    {
        // Bỏ dấu mặc định cho các địa chỉ khác của người dùng
        self::where('user_id', $this->user_id)->update(['is_default' => false]);

        // Đặt địa chỉ hiện tại làm mặc định
        $this->is_default = true;
        $this->save();
    }


    protected $casts = [
        'is_default' => 'boolean',
    ];
}
