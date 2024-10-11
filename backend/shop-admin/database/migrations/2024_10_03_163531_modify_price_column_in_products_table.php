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
        $table->decimal('price', 10, 2)->change(); // Thay đổi thành decimal(10,2)
    });
}

public function down()
{
    Schema::table('products', function (Blueprint $table) {
        $table->decimal('price', 8, 2)->change(); // Khôi phục lại nếu cần
    });
}

};
