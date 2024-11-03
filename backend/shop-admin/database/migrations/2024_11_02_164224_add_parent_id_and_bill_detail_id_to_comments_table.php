<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddParentIdAndBillDetailIdToCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_id')->nullable()->after('id');
            $table->unsignedBigInteger('bill_detail_id')->nullable()->after('updated_at');

            // Add foreign keys (optional, if you want relational integrity)
            $table->foreign('parent_id')->references('id')->on('comments')->onDelete('cascade');
            $table->foreign('bill_detail_id')->references('id')->on('bill_details')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropForeign(['bill_detail_id']);
            $table->dropColumn('parent_id');
            $table->dropColumn('bill_detail_id');
        });
    }
}
