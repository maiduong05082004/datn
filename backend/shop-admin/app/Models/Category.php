<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Các cột có thể điền vào được (fillable)
    protected $fillable = [
        'name',
        'parent_id',
        'status',
    ];

    // Thiết lập kiểu dữ liệu của cột
    protected $casts = [
        'status' => 'boolean',
    ];

    // Quan hệ một-nhiều với bảng products
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Quan hệ một-nhiều để quản lý danh mục con
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Quan hệ một-nhiều ngược lại để tìm danh mục cha
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
}
