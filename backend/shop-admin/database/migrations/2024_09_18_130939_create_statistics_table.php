<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng statistics
        Schema::create('statistics', function (Blueprint $table) {
            // ID của bảng statistics
            $table->id();

            // Ngày thống kê
            $table->string('date', 255)->comment('Ngày thống kê (dạng chuỗi)');

            // Tổng doanh thu trong ngày
            $table->integer('total_revenue')->comment('Tổng doanh thu trong ngày');

            // Tổng số đơn hàng trong ngày
            $table->integer('total_orders')->comment('Tổng số đơn hàng trong ngày');

            // Tổng số người dùng đăng ký trong ngày
            $table->integer('total_users')->comment('Tổng số người dùng đăng ký trong ngày');

            // Thời gian tạo và cập nhật
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
        // Xóa bảng statistics
        Schema::dropIfExists('statistics');
    }
}
