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
        Schema::table('table_product_costs', function (Blueprint $table) {
            // Thêm các trường mới
            $table->string('sale_status', 20)->default('active'); // Trạng thái bán hàng
            $table->date('sale_start_date')->nullable(); // Ngày bắt đầu bán
            $table->date('sale_end_date')->nullable(); // Ngày kết thúc bán
        });
    }

    public function down()
    {
        Schema::table('table_product_costs', function (Blueprint $table) {
            // Xóa các trường đã thêm
            $table->dropColumn(['sale_status', 'sale_start_date', 'sale_end_date']);
        });
    }
};
