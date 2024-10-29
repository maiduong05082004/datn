<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'start_date',
        'end_date',
        'discount_amount',
        'max_discount_amount',
        'discount_type',
        'usage_limit',
        'min_order_value',
        'promotion_type',
        'is_active',
        'category_id',
        'product_id',
        'status',
    ];

    public function getCategoryIdsAttribute()
    {
        return $this->category_id ? explode(',', $this->category_id) : [];
    }

    public function getProductIdsAttribute()
    {
        return $this->product_id ? explode(',', $this->product_id) : [];
    }

    public function setCategoryIdsAttribute($value)
    {
        $this->attributes['category_id'] = is_array($value) ? implode(',', $value) : null;
    }

    public function setProductIdsAttribute($value)
    {
        $this->attributes['product_id'] = is_array($value) ? implode(',', $value) : null;
    }
    public function userPromotions()
    {
        return $this->hasMany(UserPromotion::class, 'promotion_id');
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
