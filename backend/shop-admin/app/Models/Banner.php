<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    // Tên bảng
    protected $table = 'banners';

    protected $fillable = [
        'category_id',
        'title',
        'image_path',
        'link',
        'type', 
        'status'
    ];

    // Định nghĩa các hằng số cho loại banner
    const TYPE_MAIN = 'main'; // banner chính nhé 
    const TYPE_CATEGORY = 'category'; // banner danh mục
    const TYPE_CUSTOM = 'custom'; // banner tự do
    const TYPE_COLLECTION = 'collection'; // banner tự do

    // Hàm kiểm tra loại banner
    public function isMain()
    {
        return $this->type === self::TYPE_MAIN;
    }

    public function isCategory()
    {
        return $this->type === self::TYPE_CATEGORY;
    }


    public function isCustom()
    {
        return $this->type === self::TYPE_CUSTOM;
    }

    // Quan hệ với bảng Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
