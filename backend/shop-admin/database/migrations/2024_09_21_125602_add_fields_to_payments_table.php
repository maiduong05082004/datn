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
        Schema::table('payments', function (Blueprint $table) {
            // Thêm cột order_info cho thông tin đơn hàng (cả VNPAY và MOMO)
            $table->string('order_info')->nullable()->after('card_type');

            // Thêm cột pay_type cho MOMO (ví dụ: Ví điện tử, thẻ tín dụng, ...)
            $table->string('pay_type')->nullable()->after('order_info');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Xóa các cột đã thêm
            $table->dropColumn('order_info');
            $table->dropColumn('pay_type');
        });
    }
};
