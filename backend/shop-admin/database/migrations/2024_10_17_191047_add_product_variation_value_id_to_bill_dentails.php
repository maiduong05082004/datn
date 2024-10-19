<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProductVariationValueIdToBillDentails extends Migration
{
    /**
     * Thực hiện thay đổi trên bảng.
     */
    public function up()
    {
        Schema::table('bill_dentails', function (Blueprint $table) {
            $table->foreignId('product_variation_value_id')
                ->nullable()
                ->constrained('product_variation_values') // Bảng product_variation_values
                ->onDelete('set null'); // Nếu xóa biến thể, đặt giá trị thành null
        });
    }

    /**
     * Rollback các thay đổi.
     */
    public function down()
    {
        Schema::table('bill_dentails', function (Blueprint $table) {
            $table->dropForeign(['product_variation_value_id']);
            $table->dropColumn('product_variation_value_id');
        });
    }
}
