<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng banners
        Schema::create('banners', function (Blueprint $table) {
            // ID của banner
            $table->id();

            // Tiêu đề của banner
            $table->string('title', 255)->comment('Tiêu đề của banner');

            // Đường dẫn đến hình ảnh banner
            $table->string('image_path', 255)->comment('Đường dẫn hình ảnh của banner');

            // Liên kết của banner (khi người dùng nhấp vào)
            $table->string('link', 255)->comment('Liên kết của banner');

            // Timestamps cho created_at và updated_at
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng banners
        Schema::dropIfExists('banners');
    }
}
