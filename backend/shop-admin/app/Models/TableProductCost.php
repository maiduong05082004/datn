<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableProductCost extends Model
{
    use HasFactory;

    protected $table = 'table_product_costs';

    protected $fillable = [
        'product_id',
        'cost_price',
        'created_at',
        'updated_at',
        'supplier',
        'import_date',
        'sale_status',
        'sale_start_date',
        'sale_end_date',
    ];

    const SALE_STATUS_ACTIVE = 'active';
    const SALE_STATUS_INACTIVE = 'inactive';

    public function isActive()
    {
        return $this->sale_status === self::SALE_STATUS_ACTIVE;
    }

    public function isInactive()
    {
        return $this->sale_status === self::SALE_STATUS_INACTIVE;
    }
    // Trả về sale_status dưới dạng văn bản dễ hiểu hơn nếu cần
    public function getSaleStatusLabelAttribute()
    {
        $statuses = [
            self::SALE_STATUS_ACTIVE => 'Đang Bán',
            self::SALE_STATUS_INACTIVE => 'Ngưng Bán',
        ];

        return $statuses[$this->sale_status] ?? 'Không xác định';
    }

    // Quan hệ với bảng Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
