<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users');
            $table->foreignId('receiver_id')->constrained('users');
            $table->text('content');
            $table->string('image_url')->nullable(); // Trường lưu URL hình ảnh
            $table->boolean('is_read')->default(false); // Trạng thái đã đọc hay chưa
            $table->timestamp('read_at')->nullable(); // Thời gian đọc tin nhắn
            $table->timestamps();
        });
        
    }
    
    public function down()
    {
        Schema::dropIfExists('messages');
    }
    
};