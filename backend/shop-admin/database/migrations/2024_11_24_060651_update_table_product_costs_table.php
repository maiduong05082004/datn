<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('table_product_costs', function (Blueprint $table) {
            // Thêm trường supplier và import_date
            $table->string('supplier')->nullable()->after('cost_price'); // Trường supplier, kiểu string
            $table->date('import_date')->nullable()->after('cost_price'); // Trường import_date, kiểu date
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('table_product_costs', function (Blueprint $table) {
            // Xóa các trường nếu rollback migration
            $table->dropColumn('supplier');
            $table->dropColumn('import_date');
        });
    }
};
