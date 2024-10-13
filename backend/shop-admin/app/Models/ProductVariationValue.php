<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariationValue extends Model
{
    use HasFactory;

    // Khai báo bảng tương ứng với model này
    protected $table = 'product_variation_values';

    // Các cột có thể được gán giá trị hàng loạt
    protected $fillable = [
        'product_variation_id',
        'attribute_value_id',
        'sku',
        'stock',
        'price',
        'discount',
        'created_at',
        'updated_at'
    ];

    // Định nghĩa quan hệ với bảng ProductVariation
    public function productVariation()
    {
        return $this->belongsTo(ProductVariation::class, 'product_variation_id');
    }

    // Định nghĩa quan hệ với bảng AttributeValue
    public function attributeValue()
    {
        return $this->belongsTo(AttributeValue::class, 'attribute_value_id');
    }
    public function attribute()
    {
        return $this->hasOneThrough(
            Attribute::class, 
            AttributeValue::class, 
            'id', 
            'id', 
            'attribute_value_id', 
            'attribute_id'
        );
    }
}
