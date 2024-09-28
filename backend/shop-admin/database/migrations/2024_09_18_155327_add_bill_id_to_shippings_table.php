<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBillIdToShippingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shippings', function (Blueprint $table) {
            // Thêm cột bill_id và thiết lập khóa ngoại
            $table->unsignedBigInteger('bill_id')->nullable()->after('id');
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shippings', function (Blueprint $table) {
            // Xóa khóa ngoại và cột bill_id khi rollback
            $table->dropForeign(['bill_id']);
            $table->dropColumn('bill_id');
        });
    }
}
