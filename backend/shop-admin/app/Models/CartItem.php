<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    // Tên bảng liên kết
    protected $table = 'cart_items';

    protected $fillable = [
        'user_id',
        'product_id',
        'product_variation_value_id',
        'quantity',
        'total_price',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

  
    public function productVariationValue()
    {
        return $this->belongsTo(ProductVariationValue::class, 'product_variation_value_id');
    }
}
