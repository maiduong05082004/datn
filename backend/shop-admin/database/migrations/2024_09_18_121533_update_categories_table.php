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
            $table->string('name')->after('id');
            $table->dropColumn('name_category');
            $table->dropColumn('level');
            $table->unsignedBigInteger('parent_id')->nullable()->comment('ID của danh mục cha, null nếu là danh mục gốc')->after('name')->change();
            $table->string('image')->nullable()->after('parent_id')->comment('Ảnh của danh mục sản phẩm');
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
            $table->dropColumn('name');
            $table->unsignedInteger('level')->default(0)->comment('Mức phân cấp của danh mục, 0 là danh mục gốc')->after('name_category');
            $table->dropColumn('image');
            $table->unsignedBigInteger('parent_id')->nullable()->comment('ID của danh mục cha, null nếu là danh mục gốc')->after('level')->change();
            $table->boolean('status')->default(1)->comment('Trạng thái của danh mục, 1 là hoạt động, 0 là không hoạt động')->after('parent_id')->change();
        });
    }
}
