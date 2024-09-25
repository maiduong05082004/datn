<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            // Khóa chính của bảng
            $table->id();

            // Liên kết đến bảng bills
            $table->unsignedBigInteger('bill_id');
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');

            // Liên kết đến bảng users (người thanh toán)
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Phương thức thanh toán (ví dụ: VNPAY, MOMO, Credit Card)
            $table->string('payment_method', 255)->comment('Phương thức thanh toán');

            // Số tiền thanh toán
            $table->decimal('amount', 15, 2)->comment('Số tiền thanh toán');
            $table->string('status', 255)->comment('Trạng thái của thanh toán');

            // Thông tin giao dịch (nếu có), ví dụ như transaction ID từ cổng thanh toán
            $table->string('transaction_id')->nullable()->comment('ID giao dịch từ cổng thanh toán (nếu có)');
            $table->string('bank_code')->nullable()->comment('Mã ngân hàng (nếu có)');
            $table->string('card_type')->nullable()->comment('Loại thẻ thanh toán (nếu có)');

            // Ngày thanh toán
            $table->timestamp('pay_date')->nullable()->comment('Ngày thanh toán');

            // Lý do hủy giao dịch nếu có
            $table->string('canceled_reason')->nullable()->comment('Lý do hủy giao dịch nếu có');

            // Timestamps
            $table->timestamps();

            // Đánh chỉ mục cho các cột thường được tìm kiếm
            $table->index('bill_id');  // Đánh chỉ mục cho khóa ngoại bill_id để tăng tốc truy vấn tìm kiếm theo hóa đơn
            $table->index('user_id');  // Đánh chỉ mục cho khóa ngoại user_id để tăng tốc truy vấn tìm kiếm theo người dùng
            $table->index('status');   // Đánh chỉ mục cho cột status để tăng tốc truy vấn tìm kiếm theo trạng thái thanh toán
            $table->index('payment_method');  // Đánh chỉ mục cho cột payment_method nếu thường xuyên lọc theo phương thức thanh toán
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
