<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishlistItem extends Model
{
    use HasFactory;
    protected $table = 'wishlist_item';
    protected $fillable = [
        'user_id',
        'product_id',
        'product_variation_value_id',
        'added_at',
        'is_notified',
        'is_active',
        'notes',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariationValue()
    {
        return $this->belongsTo(ProductVariationValue::class, 'product_variation_value_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
