<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('categories', function (Blueprint $table) {
            // Đổi tên cột 'name_category' thành 'name'
            $table->renameColumn('name_category', 'name');

            // Xóa cột 'level'
            $table->dropColumn('level');

            // Thay đổi cột 'parent_id' và đặt nó sau cột 'name'
            $table->unsignedBigInteger('parent_id')->nullable()->comment('ID của danh mục cha, null nếu là danh mục gốc')->after('name')->change();

            // Thêm cột 'image' sau 'parent_id'
            $table->string('image')->nullable()->after('parent_id')->comment('Ảnh của danh mục sản phẩm');

            // Thay đổi cột 'status' thành 'boolean' và đặt nó sau 'image'
            $table->boolean('status')->default(1)->comment('Trạng thái của danh mục, 1 là hoạt động, 0 là không hoạt động')->after('image')->change();
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            // Đổi tên cột 'name' trở lại 'name_category'
            $table->renameColumn('name', 'name_category');

            // Thêm lại cột 'level' sau 'name_category'
            $table->unsignedInteger('level')->default(0)->comment('Mức phân cấp của danh mục, 0 là danh mục gốc')->after('name_category');

            // Xóa cột 'image'
            $table->dropColumn('image');

            // Thay đổi cột 'parent_id' và đặt nó sau 'level'
            $table->unsignedBigInteger('parent_id')->nullable()->comment('ID của danh mục cha, null nếu là danh mục gốc')->after('level')->change();

            // Thay đổi cột 'status' thành 'boolean' và đặt nó sau 'parent_id'
            $table->boolean('status')->default(1)->comment('Trạng thái của danh mục, 1 là hoạt động, 0 là không hoạt động')->after('parent_id')->change();
        });
    }
}
