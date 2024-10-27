<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBillDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng Bill_detail
        Schema::create('Bill_detail', function (Blueprint $table) {
            // ID của chi tiết hóa đơn
            $table->id();

            // ID của hóa đơn
            $table->unsignedBigInteger('bill_id')->comment('ID của hóa đơn');

            // ID của sản phẩm
            $table->unsignedBigInteger('product_id')->comment('ID của sản phẩm');

            // Đơn giá sản phẩm
            $table->double('don_gia')->comment('Đơn giá của sản phẩm');

            // Số lượng sản phẩm
            $table->unsignedInteger('quantity')->comment('Số lượng sản phẩm trong hóa đơn');

            // Tổng số tiền cho sản phẩm này
            $table->double('total_amount')->comment('Tổng số tiền cho sản phẩm');

            // Thời gian tạo và cập nhật
            $table->timestamps();

            // Thiết lập khóa ngoại cho bill_id
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');

            // Thiết lập khóa ngoại cho product_id
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng Bill_detail
        Schema::dropIfExists('Bill_detail');
    }
}
