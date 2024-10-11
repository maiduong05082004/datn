<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('phone')->after('name')->comment('Số điện thoại của người dùng');
            $table->string('address')->nullable()->after('email')->comment('Địa chỉ z');
            $table->string('role')->default('user')->after('password')->comment(' mặc định là user');
            // Thêm cột 'last_login_at' để lưu thời gian đăng nhập cuối cùng
            $table->timestamp('last_login_at')->nullable()->after('remember_token')->comment('Thời gian đăng nhập lần cuối của người dùng');

            // Thêm cột 'is_active' để lưu trạng thái kích hoạt của người dùng
            $table->boolean('is_active')->default(true)->after('last_login_at')->comment('Trạng thái hoạt động của người dùng, true là hoạt động');
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Xóa các cột đã thêm khi rollback
            $table->dropColumn(['phone', 'address', 'role', 'last_login_at', 'is_active']);
        });
    }
}
