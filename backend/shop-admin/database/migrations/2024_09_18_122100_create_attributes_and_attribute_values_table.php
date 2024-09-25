<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttributesAndAttributeValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng attributes
        Schema::create('attributes', function (Blueprint $table) {
            // ID thuộc tính
            $table->id();

            // Tên thuộc tính
            $table->string('name', 255)->comment('Tên của thuộc tính');

            // Loại thuộc tính (ví dụ: 1 là màu sắc, 2 là kích thước)
            $table->tinyInteger('attribute_type')->unsigned()->comment('Loại thuộc tính chính phụ');

            // Timestamps cho created_at và updated_at
            $table->timestamps();
        });

        // Tạo bảng attribute_values
        Schema::create('attribute_values', function (Blueprint $table) {
            // ID giá trị thuộc tính
            $table->id();

            // Liên kết đến bảng attributes
            $table->unsignedBigInteger('attribute_id')->comment('ID của thuộc tính liên quan');

            // Giá trị của thuộc tính (ví dụ: đỏ, xanh, nhỏ, lớn)
            $table->string('value', 255)->comment('Giá trị của thuộc tính (ví dụ: màu sắc, kích thước)');

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại attribute_id liên kết với bảng attributes
            $table->foreign('attribute_id')->references('id')->on('attributes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng attribute_values trước
        Schema::dropIfExists('attribute_values');
        
        // Sau đó xóa bảng attributes
        Schema::dropIfExists('attributes');
    }
}
