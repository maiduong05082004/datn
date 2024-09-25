<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePromotionsAndUserPromotionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng promotions
        Schema::create('promotions', function (Blueprint $table) {
            // ID của khuyến mãi
            $table->id();

            // Mã khuyến mãi
            $table->string('code', 255)->comment('Mã của chương trình khuyến mãi');

            // Mô tả chương trình khuyến mãi
            $table->text('description')->comment('Mô tả chương trình khuyến mãi');

            // Ngày bắt đầu và kết thúc khuyến mãi
            $table->date('start_date')->comment('Ngày bắt đầu của chương trình khuyến mãi');
            $table->date('end_date')->comment('Ngày kết thúc của chương trình khuyến mãi');

            // Số tiền giảm giá
            $table->decimal('discount_amount', 8, 2)->comment('Số tiền giảm giá');

            // Trạng thái khuyến mãi có đang hoạt động không
            $table->tinyInteger('is_active')->default(1)->comment('Trạng thái khuyến mãi, 1 là hoạt động, 0 là không hoạt động');

            // Trạng thái của khuyến mãi (pending, active, expired)
            $table->string('status', 50)->comment('Trạng thái của khuyến mãi (pending, active, expired)');

            // Timestamps cho created_at và updated_at
            $table->timestamps();
        });

        // Tạo bảng user_promotions
        Schema::create('user_promotions', function (Blueprint $table) {
            // ID của user_promotion
            $table->id();

            // Liên kết với bảng users
            $table->unsignedBigInteger('user_id')->comment('ID của người dùng liên quan');

            // Liên kết với bảng promotions
            $table->unsignedBigInteger('promotion_id')->comment('ID của chương trình khuyến mãi liên quan');

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại user_id liên kết với bảng users
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Thiết lập khóa ngoại promotion_id liên kết với bảng promotions
            $table->foreign('promotion_id')->references('id')->on('promotions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Xóa bảng user_promotions trước
        Schema::dropIfExists('user_promotions');
        
        // Sau đó xóa bảng promotions
        Schema::dropIfExists('promotions');
    }
}
