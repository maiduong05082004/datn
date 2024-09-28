<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Thêm cột product_variation_id
            $table->unsignedBigInteger('product_variation_id')->after('product_id')->nullable(); // Nếu sản phẩm có biến thể
    
            // Thêm khóa ngoại
            $table->foreign('product_variation_id')->references('id')->on('product_variations')->onDelete('set null');
        });
    }
    
    public function down()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Xóa khóa ngoại và cột
            $table->dropForeign(['product_variation_id']);
            $table->dropColumn('product_variation_id');
        });
    }
    
};
