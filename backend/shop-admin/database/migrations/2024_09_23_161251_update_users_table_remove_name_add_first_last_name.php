<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableRemoveNameAddFirstLastName extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Xóa cột 'name'
            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }

            // Thêm các cột 'first_name' và 'last_name'
            $table->string('first_name')->after('id');  // Thêm sau cột 'id'
            $table->string('last_name')->after('first_name');  // Thêm sau 'first_name'
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
            // Thêm lại cột 'name' khi revert
            $table->string('name')->nullable();

            // Xóa các cột 'first_name' và 'last_name'
            $table->dropColumn(['first_name', 'last_name']);
        });
    }
}
