<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name_product',
        'price',
        'stock',
        'description',
        'content',
        'view',
        'input_day',
        'category_id',
        'is_type',
        'is_hot',
        'is_hot_deal',
        'is_new',
        'is_show_home',
    ];

    protected $casts = [
        'is_type' => 'boolean',
        'is_hot' => 'boolean',
        'is_hot_deal' => 'boolean',
        'is_new' => 'boolean',
        'is_show_home' => 'boolean',
    ];

    // Quan hệ với Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }



    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }


    // Quan hệ với ProductImage
      // Liên kết với model ProductImage
      public function images()
      {
          return $this->hasMany(ProductImage::class);
      }

    // Quan hệ với Comment
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

  

    // Quan hệ với BillDetail
    public function billDetails()
    {
        return $this->hasMany(BillDentail::class, 'product_id');
    }
}
