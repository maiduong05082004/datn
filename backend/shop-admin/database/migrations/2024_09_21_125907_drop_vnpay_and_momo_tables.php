<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Kiểm tra và xóa khóa ngoại từ bảng `vnpay`
        Schema::table('vnpay', function (Blueprint $table) {
            // Xóa khóa ngoại nếu có
            $table->dropForeign(['payment_id']);
        });

        // Kiểm tra và xóa khóa ngoại từ bảng `momo`
        Schema::table('momo', function (Blueprint $table) {
            // Xóa khóa ngoại nếu có
            $table->dropForeign(['payment_id']);
        });

        // Xóa bảng vnpay
        Schema::dropIfExists('vnpay');

        // Xóa bảng momo
        Schema::dropIfExists('momo');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tạo lại bảng vnpay (nếu cần rollback)
        Schema::create('vnpay', function (Blueprint $table) {
            $table->id();
            // Các trường khác...
        });

        // Tạo lại bảng momo (nếu cần rollback)
        Schema::create('momo', function (Blueprint $table) {
            $table->id();
            // Các trường khác...
        });
    }
};
