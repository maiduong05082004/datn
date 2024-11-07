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
            $table->decimal('shipping_fee', 10, 2)->nullable()->after('order_code_shipping')->comment('Phí vận chuyển');
        });
    }
    
    public function down()
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn('shipping_fee');
        });
    }
    
};
