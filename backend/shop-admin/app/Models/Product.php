<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug',
        'name',
        'price',
        'stock',
        'description',
        'content',
        'view',
        'input_day',
        'category_id',
        'is_collection',
        'is_hot',
        'is_new',
    ];

    protected $casts = [
        'is_hot' => 'boolean',
        'is_new' => 'boolean',
        'is_collection' => 'boolean',
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
        return $this->hasMany(BillDetail::class, 'product_id');
    }
    protected $dates = ['deleted_at'];

    // Relationship with wishlist
    public function wishlistedBy()
    {
        return $this->belongsToMany(User::class, 'wishlists')->withTimestamps();
    }
    
}
