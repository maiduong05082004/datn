<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    protected $fillable = ['attribute_id', 'value','image_path'];

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }

    // Quan hệ với ProductVariationSize (Kích thước của biến thể)
    public function variationValues()
    {
        return $this->hasMany(ProductVariationValue::class, 'attribute_value_id');
    }

    // Quan hệ với ProductVariation (Màu sắc của biến thể)
    public function productVariations()
    {
        return $this->hasMany(ProductVariation::class, 'attribute_value_id');
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_variation_values', 'attribute_value_id', 'product_id');
    }
    public function productVariationValues()
    {
        return $this->hasMany(\App\Models\ProductVariationValue::class, 'attribute_value_id', 'id');
    }
}
