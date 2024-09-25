<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            // ID của danh mục
            $table->id();

            // Cột parent_id để lưu ID của danh mục cha
            $table->unsignedBigInteger('parent_id')->nullable()->comment('ID của danh mục cha, null nếu là danh mục gốc');
            $table->string('name_category', 255)->comment('Tên của danh mục sản phẩm');
            $table->tinyInteger('status')->default(1)->comment('Trạng thái của danh mục, 1 là hoạt động, 0 là không hoạt động');
            $table->unsignedInteger('level')->default(0)->comment('Mức phân cấp của danh mục, 0 là danh mục gốc');
            $table->timestamps();
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
}
