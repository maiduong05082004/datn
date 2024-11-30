<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_id',
        'product_id',
        'product_variation_value_id',
        'don_gia',
        'quantity',
        'total_amount',
        'status_comment'
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class,);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'bill_detail_id');
    }

    public function productVariationValue()
    {
        return $this->belongsTo(ProductVariationValue::class, 'product_variation_value_id');
    }
}
