<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateBillsTableForShippingAddresses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bills', function (Blueprint $table) {
            // Xóa các cột không cần thiết
            if (Schema::hasColumn('bills', 'name_receiver')) {
                $table->dropColumn('name_receiver');
            }
            if (Schema::hasColumn('bills', 'phone_receiver')) {
                $table->dropColumn('phone_receiver');
            }
            if (Schema::hasColumn('bills', 'Address')) {
                $table->dropColumn('Address');
            }

            // Thêm cột shipping_address_id để liên kết với bảng shipping_addresses
            if (!Schema::hasColumn('bills', 'shipping_address_id')) {
                $table->unsignedBigInteger('shipping_address_id')->nullable();

                // Khóa ngoại liên kết với bảng shipping_addresses
                $table->foreign('shipping_address_id')->references('id')->on('shipping_addresses')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bills', function (Blueprint $table) {
            // Thêm lại các cột nếu cần revert
            $table->string('name_receiver')->nullable();
            $table->string('phone_receiver')->nullable();
            $table->string('Address')->nullable();

            // Xóa cột shipping_address_id và khóa ngoại
            if (Schema::hasColumn('bills', 'shipping_address_id')) {
                $table->dropForeign(['shipping_address_id']);
                $table->dropColumn('shipping_address_id');
            }
        });
    }
}
