<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddImagePathToAttributeValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attribute_values', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('value'); // Thêm cột image_path cho phép null, nằm sau cột value
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('attribute_values', function (Blueprint $table) {
            $table->dropColumn('image_path'); // Xóa cột image_path nếu rollback
        });
    }
}
