<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Xóa cột is_hot_deal và is_show_home
            $table->dropColumn(['is_hot_deal', 'is_show_home']);
            
            // Đổi tên cột is_type thành is_collection
            $table->renameColumn('is_type', 'is_collection');
        });
    }
    
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            // Khôi phục lại các cột bị xóa
            $table->tinyInteger('is_hot_deal')->default(0);
            $table->tinyInteger('is_show_home')->default(0);
            
            // Đổi tên lại is_collection về is_type
            $table->renameColumn('is_collection', 'is_type');
        });
    }
    
};
