<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddQuantityAndVariationToTableProductCosts extends Migration
{
    public function up()
    {
        Schema::table('table_product_costs', function (Blueprint $table) {
            // Thêm cột quantity để lưu số lượng
            $table->integer('quantity')->default(0)->after('cost_price');

            // Thêm cột product_variation_value_id để liên kết với bảng product_variation_values
            $table->foreignId('product_variation_value_id')->nullable()->constrained('product_variation_values')->onDelete('cascade')->after('product_id');
        });
    }

    public function down()
    {
        Schema::table('table_product_costs', function (Blueprint $table) {
            // Xóa các cột đã thêm
            $table->dropColumn('quantity');
            $table->dropForeign(['product_variation_value_id']);
            $table->dropColumn('product_variation_value_id');
        });
    }
}
