<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductVariationValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng product_variation_values
        Schema::create('product_variation_values', function (Blueprint $table) {
            // ID của giá trị biến thể sản phẩm
            $table->id();

            // Liên kết với bảng product_variations
            $table->unsignedBigInteger('product_variation_id')->comment('ID của biến thể sản phẩm');

            // Liên kết với bảng attribute_values
            $table->unsignedBigInteger('attribute_value_id')->comment('ID của giá trị thuộc tính liên quan');

            // Mã sản phẩm biến thể (SKU)
            $table->string('sku', 255)->comment('Mã sản phẩm biến thể (SKU)');

            // Số lượng hàng trong kho của biến thể
            $table->integer('stock')->comment('Số lượng hàng tồn kho của biến thể');

            // Giá của biến thể
            $table->decimal('price', 10, 2)->comment('Giá của biến thể');

            // Phần trăm giảm giá của biến thể
            $table->integer('discount')->default(0)->comment('Phần trăm giảm giá cho biến thể, mặc định là 0');

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại product_variation_id liên kết với bảng product_variations
            $table->foreign('product_variation_id')->references('id')->on('product_variations')->onDelete('cascade');

            // Thiết lập khóa ngoại attribute_value_id liên kết với bảng attribute_values
            $table->foreign('attribute_value_id')->references('id')->on('attribute_values')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng product_variation_values
        Schema::dropIfExists('product_variation_values');
    }
}
