<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductVariationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng product_variations
        Schema::create('product_variations', function (Blueprint $table) {
            // ID của biến thể sản phẩm
            $table->id();

            // Liên kết với bảng products
            $table->unsignedBigInteger('product_id')->comment('ID của sản phẩm liên quan đến biến thể');

            // Liên kết với bảng groups
            $table->unsignedBigInteger('group_id')->comment('ID của nhóm thuộc tính');

            // Liên kết với bảng attribute_values
            $table->unsignedBigInteger('attribute_value_id')->comment('ID của giá trị thuộc tính liên quan');

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại product_id liên kết với bảng products
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');

            // Thiết lập khóa ngoại group_id liên kết với bảng groups
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');

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
        // Xóa bảng product_variations
        Schema::dropIfExists('product_variations');
    }
}
