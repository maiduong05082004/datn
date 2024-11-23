<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'total_revenue',
        'total_orders',
        'total_users',
        'total_profit',
        'top_selling_product_id',
        'top_selling_quantity',
        'total_product_views',
        'total_cart_adds',
        'total_wishlist_adds',
    ];
}
