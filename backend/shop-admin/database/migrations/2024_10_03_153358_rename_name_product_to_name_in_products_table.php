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
        // Đổi tên cột name_product thành name
        $table->renameColumn('name_product', 'name');
    });
}

public function down()
{
    Schema::table('products', function (Blueprint $table) {
        // Đổi tên lại cột name về name_product nếu rollback
        $table->renameColumn('name', 'name_product');
    });
}

};
