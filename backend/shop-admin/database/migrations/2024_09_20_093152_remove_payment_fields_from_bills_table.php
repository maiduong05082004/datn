<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemovePaymentFieldsFromBillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bills', function (Blueprint $table) {
            // Xóa các trường không cần thiết
            $table->dropColumn('payment_method');
            $table->dropColumn('pay_status');
            $table->dropColumn('type_pay');
            $table->dropColumn('canceled_reason');
            $table->dropColumn('status_payment'); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bills', function (Blueprint $table) {
            // Thêm lại các trường nếu rollback migration
            $table->string('payment_method', 255)->nullable();
            $table->string('pay_status', 255)->nullable();
            $table->string('type_pay', 255)->nullable();
            $table->string('canceled_reason', 255)->nullable();
            $table->string('status_payment', 255)->nullable();  // Thêm lại status_payment nếu rollback
        });
    }
}
