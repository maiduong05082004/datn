<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsAndAttributeGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Tạo bảng groups
        Schema::create('groups', function (Blueprint $table) {
            // ID của nhóm
            $table->id();
            // Tên của nhóm
            $table->string('name', 255)->comment('Tên của nhóm biến thể');
            // Timestamps cho created_at và updated_at
            $table->timestamps();
        });

        // Tạo bảng attribute_groups
        Schema::create('attribute_groups', function (Blueprint $table) {
            // ID của bảng attribute_groups
            $table->id();

            // Liên kết với bảng groups
            $table->unsignedBigInteger('group_id');

            // Liên kết với bảng attributes
            $table->unsignedBigInteger('attribute_id');

            // Timestamps cho created_at và updated_at
            $table->timestamps();

            // Thiết lập khóa ngoại group_id liên kết với bảng groups
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');

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
        // Xóa bảng attribute_groups trước
        Schema::dropIfExists('attribute_groups');
        
        // Sau đó xóa bảng groups
        Schema::dropIfExists('groups');
    }
}
