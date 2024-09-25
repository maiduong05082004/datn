<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMomoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('momo', function (Blueprint $table) {
            $table->id();  // ID tự động tăng
            $table->unsignedBigInteger('payment_id');  // Liên kết với bảng payments
            $table->string('partner_code', 50);  // Mã đối tác của MOMO
            $table->integer('order_id');  // ID của đơn hàng
            $table->string('amount', 50);  // Số tiền thanh toán
            $table->string('order_info', 100);  // Thông tin đơn hàng
            $table->string('order_type', 50);  // Loại đơn hàng
            $table->integer('trans_id');  // ID giao dịch MOMO
            $table->string('pay_type', 50);  // Loại thanh toán

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Khóa ngoại liên kết với bảng payments
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
        Schema::dropIfExists('momo');
    }
}
