<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariationQuantity extends Model
{
    use HasFactory;

    protected $table = 'product_variation_quantities';

    protected $fillable = [
        'product_variation_value_id',
        'quantity',
    ];

    /**
     * Relationship: Belongs to ProductVariationValue
     */
    public function productVariationValue()
    {
        return $this->belongsTo(ProductVariationValue::class, 'product_variation_value_id');
    }
}
