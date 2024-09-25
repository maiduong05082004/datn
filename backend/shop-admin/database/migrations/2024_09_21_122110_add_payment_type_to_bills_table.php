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
        Schema::table('bills', function (Blueprint $table) {
            // Thêm cột payment_type
            $table->string('payment_type')->after('status_bill')->nullable(); // Giả sử payment_type là kiểu string và có thể null
        });
    }
    
    public function down()
    {
        Schema::table('bills', function (Blueprint $table) {
            // Xóa cột payment_type
            $table->dropColumn('payment_type');
        });
    }
    
};
