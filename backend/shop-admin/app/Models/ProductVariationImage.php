<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariationImage extends Model
{
    use HasFactory;

    protected $table = 'product_variation_images';

    protected $fillable = [
        'image_path',
        'image_type',
        'created_at',
        'updated_at',
        'product_variation_id',

    ];

   

    /**
     * Relationship with the AttributeValue model (representing color).
     */
    public function attributeValue()
    {
        return $this->belongsTo(AttributeValue::class);
    }


    public function productVariation()
    {
        return $this->belongsTo(ProductVariation::class, 'product_variation_id');
    }
    

}
