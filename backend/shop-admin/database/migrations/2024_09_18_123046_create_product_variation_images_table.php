<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductVariationImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng product_variation_images
        Schema::create('product_variation_images', function (Blueprint $table) {
            // ID của hình ảnh biến thể
            $table->id();

            // Liên kết với bảng product_variations
            $table->unsignedBigInteger('product_variation_id');

            // Đường dẫn hình ảnh của biến thể
            $table->string('image_path', 255);

            // Loại hình ảnh (thumbnail, album, variant)
            $table->enum('image_type', ['thumbnail', 'album', 'variant']);

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại product_variation_id liên kết với bảng product_variations
            $table->foreign('product_variation_id')->references('id')->on('product_variations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng product_variation_images
        Schema::dropIfExists('product_variation_images');
    }
}
