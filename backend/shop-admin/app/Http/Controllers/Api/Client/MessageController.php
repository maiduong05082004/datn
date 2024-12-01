<?php

namespace App\Http\Controllers\Api\Client;

use App\Events\ChatEvent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function getUserMessages(Request $request)
    {
        $userId = auth()->user()->id; 

        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        // Lấy tất cả tin nhắn giữa client và admin
        $messages = Message::with(['sender:id,name', 'receiver:id,name'])
            ->where(function ($query) use ($userId, $admin) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', $admin->id) // Tin nhắn gửi từ user đến admin
                      ->orWhere('receiver_id', $userId)
                      ->where('sender_id', $admin->id); // Tin nhắn gửi từ admin đến user
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }


    public function sendMessage(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240', // 10MB max file size
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 400);
        }

        // Lưu ảnh vào Cloudinary nếu có
        $image_url = null;
        if ($request->hasFile('image_url')) {
            $uploadedFile = $request->file('image_url');
            $upload = Cloudinary::upload($uploadedFile->getRealPath(), [
                'folder' => 'messages/'
            ]);
            $image_url = $upload->getSecurePath();
        }

        // Lấy thông tin admin từ bảng users
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        // Tạo tin nhắn
        $message = Message::create([
            'sender_id' => $request->user()->id, // ID của client
            'receiver_id' => $admin->id, // ID của admin
            'message' => $request->message,
            'image_url' => $image_url,
            'is_read' => false,
        ]);

        // Phát sóng sự kiện chat
        broadcast(new ChatEvent($message));  // Giả sử bạn đã cấu hình sự kiện này

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message,
        ]);
    }
}
