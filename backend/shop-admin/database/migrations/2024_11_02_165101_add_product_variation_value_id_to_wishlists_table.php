<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProductVariationValueIdToWishlistsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->unsignedBigInteger('product_variation_value_id')->nullable()->after('product_id');

            // Add foreign key if needed
            $table->foreign('product_variation_value_id')->references('id')->on('product_variation_values')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropForeign(['product_variation_value_id']);
            $table->dropColumn('product_variation_value_id');
        });
    }
}
