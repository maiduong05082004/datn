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
        Schema::table('bills', function (Blueprint $table) {
            $table->decimal('discounted_amount', 10, 2)->nullable()->after('shipping_fee')->comment('Số tiền giảm giá sản phẩm sau khi áp dụng khuyến mãi');
            $table->decimal('discounted_shipping_fee', 10, 2)->nullable()->after('discounted_amount')->comment('Số tiền giảm giá phí ship sau khi áp dụng khuyến mãi');
        });
    }
    
    public function down()
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn('discounted_amount');
            $table->dropColumn('discounted_shipping_fee');
        });
    }
    
};
