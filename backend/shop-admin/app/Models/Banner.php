<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    // Tên bảng
    protected $table = 'banners';

    // Các trường có thể điền
    protected $fillable = [
        'title',
        'image_path',
        'link',
    ];
}
