<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path',
        'image_type',
      
    ];

    // Quan hệ với Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

 
}
