<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('statistics', function (Blueprint $table) {
            $table->decimal('total_profit', 15, 2)->default(0)->comment('Tổng lợi nhuận trong ngày');
            $table->unsignedBigInteger('top_selling_product_id')->nullable()->comment('ID sản phẩm bán chạy nhất trong ngày');
            $table->integer('top_selling_quantity')->default(0)->comment('Số lượng bán ra của sản phẩm bán chạy nhất trong ngày');
            $table->integer('total_product_views')->default(0)->comment('Tổng lượt xem sản phẩm trong ngày');
            $table->integer('total_cart_adds')->default(0)->comment('Tổng lượt thêm vào giỏ hàng trong ngày');
            $table->integer('total_wishlist_adds')->default(0)->comment('Tổng lượt thêm vào wishlist trong ngày');

            $table->foreign('top_selling_product_id')->references('id')->on('products')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('statistics', function (Blueprint $table) {
            $table->dropColumn([
                'total_profit',
                'top_selling_product_id',
                'top_selling_quantity',
                'total_product_views',
                'total_cart_adds',
                'total_wishlist_adds',
            ]);
        });
    }
};
