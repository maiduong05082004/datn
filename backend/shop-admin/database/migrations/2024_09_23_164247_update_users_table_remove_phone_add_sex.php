<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableRemovePhoneAddSex extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Xóa cột 'phone'
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }

            // Thêm cột 'sex'
            $table->enum('sex', ['male', 'female', 'other'])->nullable()->after('date_of_birth');  // Thêm sau cột 'date_of_birth'
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
            // Thêm lại cột 'phone' khi revert
            $table->string('phone')->nullable();

            // Xóa cột 'sex' khi revert
            $table->dropColumn('sex');
        });
    }
}
