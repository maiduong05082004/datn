<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShippingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng shippings
        Schema::create('shippings', function (Blueprint $table) {
            // ID của vận chuyển
            $table->id();

            // Phương thức vận chuyển
            $table->string('method', 255)->comment('Phương thức vận chuyển (ví dụ: Chuyển phát nhanh, thường...)');

            // Nhà cung cấp dịch vụ vận chuyển
            $table->string('provider', 255)->comment('Nhà cung cấp dịch vụ vận chuyển');

            // Mã theo dõi đơn hàng
            $table->string('tracking_number', 255)->nullable()->comment('Mã theo dõi đơn hàng');

            // Phí vận chuyển
            $table->decimal('shipping_fee', 10, 2)->comment('Phí vận chuyển');

            // Trạng thái vận chuyển
            $table->string('status', 255)->comment('Trạng thái vận chuyển ');

            // Ngày giao hàng dự kiến
            $table->timestamp('estimated_delivery_date')->nullable()->comment('Ngày giao hàng dự kiến');

            // Ngày giao hàng thực tế
            $table->timestamp('actual_delivery_date')->nullable()->comment('Ngày giao hàng thực tế');

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
        // Xóa bảng shippings
        Schema::dropIfExists('shippings');
    }
}
