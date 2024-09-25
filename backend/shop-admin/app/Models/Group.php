<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    // Khai báo bảng tương ứng với model này (nếu tên bảng khác với tên model)
    protected $table = 'groups';

    // Các cột có thể được gán giá trị hàng loạt
    protected $fillable = [
        'name',  // Thêm các cột khác nếu cần
        'created_at',
        'updated_at'
    ];

    // Định nghĩa quan hệ với bảng AttributeGroups
    public function attributeGroups()
    {
        return $this->hasMany(AttributeGroup::class, 'group_id');
    }

    // Các quan hệ khác nếu cần
}
