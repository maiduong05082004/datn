<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng comments
        Schema::create('comments', function (Blueprint $table) {
            // ID của comment
            $table->id();

            // Liên kết với bảng users (ID người dùng đã bình luận)
            $table->unsignedBigInteger('user_id')->comment('ID của người dùng');

            // Liên kết với bảng products (ID của sản phẩm được bình luận)
            $table->unsignedBigInteger('product_id')->comment('ID của sản phẩm');

            // Nội dung của bình luận
            $table->text('content')->comment('Nội dung của bình luận');

            // Ngày giờ bình luận
            $table->timestamp('commentDate')->comment('Ngày giờ của bình luận');

            // Đếm số lần bị báo cáo (reported)
            $table->integer('reported_count')->default(0)->comment('Số lần bình luận bị báo cáo');

            // Trạng thái báo cáo
            $table->tinyInteger('is_reported')->default(0)->comment('Bình luận đã bị báo cáo hay chưa');

            // Trạng thái kiểm duyệt bình luận (pending, approved, flagged, rejected)
            $table->string('moderation_status')->default('pending')->comment('Trạng thái kiểm duyệt của bình luận');

            // Kiểm soát hiển thị bình luận (ẩn/hiển thị)
            $table->tinyInteger('is_visible')->default(1)->comment('Hiển thị bình luận hay không');

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
        // Xóa bảng comments
        Schema::dropIfExists('comments');
    }
}
