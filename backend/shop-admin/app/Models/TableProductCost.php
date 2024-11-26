<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableProductCost extends Model
{
    use HasFactory;
    protected $table = 'table_product_costs';

    // Cột có thể gán giá trị (mass assignable)
    protected $fillable = [
        'product_id',
        'cost_price',
        'created_at',
        'updated_at',
        'supplier',
        'import_date'
    ];

    // Định nghĩa mối quan hệ với bảng products (mỗi bản ghi product_costs sẽ thuộc về 1 product)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
