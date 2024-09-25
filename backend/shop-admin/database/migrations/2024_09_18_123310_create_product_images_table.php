<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng product_images
        Schema::create('product_images', function (Blueprint $table) {
            // ID của hình ảnh sản phẩm
            $table->id();

            // Liên kết với bảng products
            $table->unsignedBigInteger('product_id');

            // Đường dẫn hình ảnh
            $table->string('image_path', 255);

            // Loại hình ảnh (thumbnail, album)
            $table->enum('image_type', ['thumbnail', 'album']);

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại product_id liên kết với bảng products
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
        // Xóa bảng product_images
        Schema::dropIfExists('product_images');
    }
}
