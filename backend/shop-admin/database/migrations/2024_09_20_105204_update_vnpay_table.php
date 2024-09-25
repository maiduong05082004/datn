<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateVnpayTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vnpay', function (Blueprint $table) {
            // Xóa khóa ngoại liên kết với user_id và bill_id
            $table->dropForeign(['user_id']);
            $table->dropForeign(['bill_id']);
            $table->dropColumn('user_id');
            $table->dropColumn('bill_id');

            // Thêm khóa ngoại mới liên kết với bảng payments
            $table->unsignedBigInteger('payment_id')->after('id');
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vnpay', function (Blueprint $table) {
            // Phục hồi lại các trường user_id và bill_id nếu cần
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('bill_id')->nullable();
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');

            // Xóa khóa ngoại payment_id
            $table->dropForeign(['payment_id']);
            $table->dropColumn('payment_id');
        });
    }
}
