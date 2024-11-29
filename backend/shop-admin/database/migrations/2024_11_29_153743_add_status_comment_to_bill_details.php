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
        Schema::table('bill_details', function (Blueprint $table) {
            $table->integer('status_comment')->default(0)->after('total_amount')->comment('0 là chưa bình luận, 1 là đã binh luận');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bill_details', function (Blueprint $table) {
            $table->dropColumn('status_comment');
        });
    }
};
