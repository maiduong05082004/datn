<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableAddNameRemoveFirstLastName extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Thêm cột 'name'
            $table->string('name')->after('id');

            // Xóa cột 'first_name' và 'last_name'
            $table->dropColumn(['first_name', 'last_name']);
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Xóa cột 'name'
            $table->dropColumn('name');

            // Thêm lại cột 'first_name' và 'last_name'
            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
        });
    }
}