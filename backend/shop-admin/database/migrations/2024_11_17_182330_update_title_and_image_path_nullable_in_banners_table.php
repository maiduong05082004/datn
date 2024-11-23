<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTitleAndImagePathNullableInBannersTable extends Migration
{
    public function up()
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('title')->nullable()->change(); // Cho phép null
            $table->string('image_path')->nullable()->change(); // Cho phép null
        });
    }

    public function down()
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('title')->nullable(false)->change(); // Trở lại không cho phép null
            $table->string('image_path')->nullable(false)->change(); // Trở lại không cho phép null
        });
    }
}
