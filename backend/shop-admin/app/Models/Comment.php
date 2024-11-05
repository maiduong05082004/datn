<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'Pending';    // Đang chờ duyệt
    const STATUS_APPROVED = 'Approved';          // Duyệt thành công
    const STATUS_REJECTED = 'Rejected';  // Duyệt không thành công (từ ngữ tục tĩu)
    protected $fillable = [
        'user_id',
        'product_id',
        'content',
        'commentDate',
        'is_reported',         // Thêm cột is_reported cho kiểm duyệt tự động
        'reported_count',      // Thêm cột reported_count cho số lần bị báo cáo bởi người dùng
        'moderation_status',   // Thêm cột moderation_status cho trạng thái kiểm duyệt
        'is_visible',          // Thêm cột is_visible để kiểm soát hiển thị
        'parent_id',
        'bill_detail_id',
        'stars'
    ];

    // Liên kết với bảng User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Liên kết với bảng Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function billDentail()
    {
        return $this->belongsTo(BillDentail::class, 'bill_detail_id');
    }
}
