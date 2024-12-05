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
    // Lấy tin nhắn của người dùng
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
            $messages = Message::with(['sender:id,name', 'receiver:id,name'])
            ->where(function ($query) use ($userId, $admin) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', $admin->id)
                      ->orWhere('receiver_id', $userId)
                      ->where('sender_id', $admin->id);
            })
            ->withTrashed()  
            ->orderBy('created_at', 'desc')
            ->get();
    
        return response()->json($messages);
    }
    

    // Gửi tin nhắn từ client
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'string|max:1000',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 400);
        }

        $image_url = null;
        if ($request->hasFile('image_url')) {
            $uploadedFile = $request->file('image_url');
            $upload = Cloudinary::upload($uploadedFile->getRealPath(), [
                'folder' => 'messages/'
            ]);
            $image_url = $upload->getSecurePath();
        }

        $admin = User::where('role', 'admin')->first(); 

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
            ], 404);
        }

        $message = Message::create([
            'sender_id' => $request->user()->id, 
            'receiver_id' => $admin->id,  
            'content' => $request->content,  
            'image_url' => $image_url,  
            'is_read' => false, 
        ]);

        broadcast(new ChatEvent($message));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message,
        ]);
    }
}
