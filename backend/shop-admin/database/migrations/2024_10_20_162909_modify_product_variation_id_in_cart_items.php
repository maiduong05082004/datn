<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyProductVariationIdInCartItems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Xóa khóa ngoại cũ liên quan đến product_variation_id (nếu có)
            $table->dropForeign(['product_variation_id']);

            // Xóa luôn cột product_variation_id nếu không cần nữa
            $table->dropColumn('product_variation_id');

            // Thêm cột product_variation_value_id cho phép null
            $table->unsignedBigInteger('product_variation_value_id')
                  ->nullable()
                  ->after('id');

            // Thêm khóa ngoại mới cho product_variation_value_id
            $table->foreign('product_variation_value_id')
                  ->references('id')->on('product_variation_values')
                  ->onDelete('set null'); // Khi bản ghi bị xóa, đặt cột này thành null
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Xóa khóa ngoại của product_variation_value_id
            $table->dropForeign(['product_variation_value_id']);

            // Xóa cột product_variation_value_id
            $table->dropColumn('product_variation_value_id');

            // Khôi phục lại cột product_variation_id
            $table->unsignedBigInteger('product_variation_id')->after('id');

            // Khôi phục khóa ngoại cũ cho product_variation_id
            $table->foreign('product_variation_id')
                  ->references('id')->on('product_variations')
                  ->onDelete('cascade');
        });
    }
}
