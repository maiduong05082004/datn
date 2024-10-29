<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up():void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->integer('usage_limit')->nullable()->after('discount_amount');
            $table->decimal('min_order_value', 10, 2)->nullable()->after('usage_limit');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->dropColumn('usage_limit');
            $table->dropColumn('min_order_value');
        });
    }
};
