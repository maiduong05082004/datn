<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    // Tên bảng liên kết
    protected $table = 'cart_items';

    // Các trường có thể được điền thông qua create hoặc update
    protected $fillable = [
        'user_id',
        'product_id',
        'product_variation_id',
        'quantity',
        'total_price',
    ];

    /**
     * Quan hệ với người dùng
     * Mỗi mục giỏ hàng thuộc về một người dùng
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Quan hệ với sản phẩm
     * Mỗi mục giỏ hàng thuộc về một sản phẩm
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariation()
    {
        return $this->belongsTo(ProductVariation::class, 'product_variation_id');
    }
}
