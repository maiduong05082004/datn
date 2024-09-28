<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVnpayTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng vnpay
        Schema::create('vnpay', function (Blueprint $table) {
            // ID của giao dịch vnpay
            $table->id();

            // Liên kết với bảng bills
            $table->unsignedBigInteger('bill_id')->comment('ID của hóa đơn');

            // Liên kết với bảng users
            $table->unsignedBigInteger('user_id')->comment('ID của người dùng');

            // Số tiền thanh toán qua VNPAY
            $table->decimal('vnp_Amount', 15, 2)->comment('Số tiền thanh toán qua VNPAY');

            // Mã ngân hàng
            $table->string('vnp_BankCode', 10)->comment('Mã ngân hàng');

            // Mã giao dịch ngân hàng
            $table->string('vnp_BankTranNo', 255)->comment('Mã giao dịch ngân hàng');

            // Loại thẻ
            $table->string('vnp_CardType', 20)->comment('Loại thẻ');

            // Thông tin đơn hàng
            $table->string('vnp_OrderInfo', 255)->comment('Thông tin đơn hàng');

            // Ngày thanh toán
            $table->string('vnp_PayDate', 50)->comment('Ngày thanh toán');

            // Mã terminal VNPAY
            $table->string('vnp_TmnCode', 50)->comment('Mã terminal VNPAY');

            // Mã giao dịch VNPAY
            $table->string('vnp_TransactionNo', 50)->comment('Mã giao dịch VNPAY');

            // Trạng thái giao dịch (pending, completed, failed, canceled)
            $table->string('transaction_status', 255)->comment('Trạng thái của giao dịch VNPAY');

            // Thời gian tạo và cập nhật
            $table->timestamps();

            // Thiết lập khóa ngoại cho bill_id
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');

            // Thiết lập khóa ngoại cho user_id
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng vnpay
        Schema::dropIfExists('vnpay');
    }
}
