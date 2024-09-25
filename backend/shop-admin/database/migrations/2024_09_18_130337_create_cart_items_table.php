<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng cart_items
        Schema::create('cart_items', function (Blueprint $table) {
            // ID của mục giỏ hàng
            $table->id();

            // Liên kết với bảng users
            $table->unsignedBigInteger('user_id')->comment('ID của người dùng');

            // Liên kết với bảng products
            $table->unsignedBigInteger('product_id')->comment('ID của sản phẩm');

            // Số lượng sản phẩm trong giỏ hàng
            $table->integer('quantity')->comment('Số lượng sản phẩm');

            // Thời gian tạo và cập nhật
            $table->timestamps();

            // Thiết lập khóa ngoại cho user_id
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

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
        // Xóa bảng cart_items
        Schema::dropIfExists('cart_items');
    }
}
