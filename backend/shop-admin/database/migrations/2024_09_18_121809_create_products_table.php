<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            // ID sản phẩm
            $table->id();

            // Cột slug để lưu đường dẫn thân thiện SEO
            $table->string('slug', 255)->comment('Slug sản phẩm cho SEO');

            // Tên sản phẩm
            $table->string('name_product', 255)->comment('Tên của sản phẩm');

            // Giá sản phẩm
            $table->decimal('price', 8, 2)->comment('Giá sản phẩm');

            // Mô tả ngắn gọn về sản phẩm
            $table->string('description', 255)->comment('Mô tả ngắn gọn về sản phẩm');

            // Nội dung chi tiết về sản phẩm
            $table->text('content')->comment('Nội dung chi tiết về sản phẩm');

            // Lượt xem sản phẩm
            $table->unsignedBigInteger('view')->default(0)->comment('Lượt xem sản phẩm');

            // Ngày nhập sản phẩm
            $table->date('input_day')->comment('Ngày nhập sản phẩm vào hệ thống');

            // Liên kết đến bảng danh mục (categories)
            $table->unsignedBigInteger('category_id')->comment('ID của danh mục chứa sản phẩm');

            // Cột boolean để xác định loại sản phẩm
            $table->boolean('is_type')->default(0)->comment('Xác định loại sản phẩm, 1 là đặc biệt');

            // Cột boolean để xác định sản phẩm nổi bật
            $table->boolean('is_hot')->default(0)->comment('Xác định sản phẩm nổi bật');

            // Cột boolean để xác định sản phẩm có ưu đãi đặc biệt
            $table->boolean('is_hot_deal')->default(0)->comment('Xác định sản phẩm có ưu đãi đặc biệt');

            // Cột boolean để xác định sản phẩm mới
            $table->boolean('is_new')->default(0)->comment('Xác định sản phẩm mới');

            // Cột boolean để xác định sản phẩm có hiển thị ở trang chủ
            $table->boolean('is_show_home')->default(0)->comment('Xác định sản phẩm có hiển thị ở trang chủ');

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
