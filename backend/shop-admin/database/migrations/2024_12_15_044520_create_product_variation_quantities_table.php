<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductVariationQuantitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_variation_quantities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_variation_value_id');
            $table->integer('quantity')->default(0);
            $table->timestamps();

            // Định nghĩa khóa ngoại
            $table->foreign('product_variation_value_id')
                ->references('id')
                ->on('product_variation_values')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_variation_quantities');
    }
}
