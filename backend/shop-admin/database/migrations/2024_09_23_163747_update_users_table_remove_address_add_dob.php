<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableRemoveAddressAddDob extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Xóa cột 'address'
            if (Schema::hasColumn('users', 'address')) {
                $table->dropColumn('address');
            }

            // Thêm cột 'date_of_birth'
            $table->date('date_of_birth')->nullable()->after('last_name');  // Thêm sau cột 'last_name'
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Thêm lại cột 'address' khi revert
            $table->string('address')->nullable();

            // Xóa cột 'date_of_birth' khi revert
            $table->dropColumn('date_of_birth');
        });
    }
}
