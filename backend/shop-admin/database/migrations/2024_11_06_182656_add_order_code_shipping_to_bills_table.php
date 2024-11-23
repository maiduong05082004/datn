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
            $table->string('order_code_shipping')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn('order_code_shipping');
        });
    }
    
};
