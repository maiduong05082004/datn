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
        Schema::table('product_variations', function (Blueprint $table) {
            // Thêm cột stock
            $table->integer('stock')->after('attribute_value_id')->default(0); // Giả sử stock là số nguyên và mặc định là 0
        });
    }
    
    public function down()
    {
        Schema::table('product_variations', function (Blueprint $table) {
            // Xóa cột stock
            $table->dropColumn('stock');
        });
    }
    
};
