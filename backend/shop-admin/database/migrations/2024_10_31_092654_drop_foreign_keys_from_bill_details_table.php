<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropForeignKeysFromBillDetailsTable extends Migration
{
    public function up()
    {
        Schema::table('bill_details', function (Blueprint $table) {
            // Bỏ khóa ngoại cho product_id
            $table->dropForeign(['product_id']);
            // Bỏ khóa ngoại cho product_variation_value_id
            $table->dropForeign(['product_variation_value_id']);
        });
    }

    public function down()
    {
        Schema::table('bill_details', function (Blueprint $table) {
            // Khôi phục khóa ngoại nếu cần
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('product_variation_value_id')->references('id')->on('product_variation_values')->onDelete('cascade');
        });
    }
}
