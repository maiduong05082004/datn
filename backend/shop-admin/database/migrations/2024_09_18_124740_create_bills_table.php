<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng bills
        Schema::create('bills', function (Blueprint $table) {
            // ID của hóa đơn
            $table->id();

            // Liên kết với bảng shippings, cho phép NULL
            $table->unsignedBigInteger('shipping_id')->nullable()->comment('ID của vận chuyển liên quan');

            // Mã đơn hàng
            $table->string('code_orders', 255)->comment('Mã đơn hàng');

            // ID của người dùng
            $table->unsignedBigInteger('user_id')->comment('ID của người dùng');

            // Tên người nhận hàng
            $table->string('name_receiver', 255)->comment('Tên người nhận hàng');

            // Email của người nhận hàng
            $table->string('email_receiver', 255)->comment('Email người nhận hàng');

            // Số điện thoại của người nhận hàng
            $table->string('phone_receiver', 10)->comment('Số điện thoại người nhận hàng');

            // Địa chỉ giao hàng
            $table->string('Address', 255)->comment('Địa chỉ giao hàng');

            // Ghi chú của đơn hàng
            $table->string('note', 255)->nullable()->comment('Ghi chú của đơn hàng');

            // Trạng thái hóa đơn
            $table->string('status_bill', 255)->comment('Trạng thái hóa đơn');

            // Ngày bị hủy (nếu có)
            $table->timestamp('canceled_at')->nullable()->comment('Ngày hóa đơn bị hủy');

            // Trạng thái thanh toán
            $table->string('status_payment', 255)->comment('Trạng thái thanh toán');

            // Phương thức thanh toán
            $table->string('payment_method', 255)->comment('Phương thức thanh toán (ví dụ: thẻ tín dụng, tiền mặt, ví điện tử)');

            // Tổng phụ
            $table->decimal('subtotal', 10, 2)->comment('Tổng phụ của hóa đơn');

            // Tổng tiền của hóa đơn
            $table->decimal('total', 10, 2)->comment('Tổng tiền của hóa đơn');

            // Liên kết với bảng promotions
            $table->unsignedBigInteger('promotion_id')->nullable()->comment('ID của chương trình khuyến mãi áp dụng');

            // Phương thức thanh toán
            $table->string('type_pay', 255)->comment('Phương thức thanh toán');

            // Trạng thái thanh toán
            $table->string('pay_status', 255)->comment('Trạng thái thanh toán (ví dụ: Đã thanh toán, Chưa thanh toán)');

            // Lý do hủy đơn hàng (nếu có)
            $table->string('canceled_reason', 255)->nullable()->comment('Lý do hủy đơn hàng');

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại cho shipping_id
            $table->foreign('shipping_id')->references('id')->on('shippings')->onDelete('set null');

            // Thiết lập khóa ngoại cho promotion_id
            $table->foreign('promotion_id')->references('id')->on('promotions')->onDelete('set null');

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
        // Xóa bảng bills
        Schema::dropIfExists('bills');
    }
}
