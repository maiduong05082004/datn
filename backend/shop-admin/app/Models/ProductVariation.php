<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
    protected $fillable = ['product_id', 'group_id', 'attribute_value_id', 'stock', 'created_at', 'updated_at'];


    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // mối quan hệ đến bảng AttributeGroup ( nhớ kỹ)
    // public function group()
    // {
    //     return $this->belongsTo(AttributeGroup::class, 'group_id');
    // }

    public function attributeValues()
    {
        return $this->belongsToMany(AttributeValue::class, 'product_variation_values', 'product_variation_id', 'attribute_value_id');
    }
    
    // mối quan hệ đến bảng Group
    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function variationValues()
    {
        return $this->hasMany(ProductVariationValue::class, 'product_variation_id');
    }

    public function variationImages()
    {
        return $this->hasMany(ProductVariationImage::class, 'product_variation_id');
    }



    // Quan hệ với ProductVariationSize (mỗi biến thể màu sắc có nhiều kích thước)
    public function values()
    {
        return $this->hasMany(ProductVariationValue::class);
    }

    public function attributeValue()
    {
        return $this->belongsTo(AttributeValue::class, 'attribute_value_id');
    }
    public function images()
    {
        return $this->hasMany(ProductVariationImage::class, 'product_variation_id');
    }
    
}
