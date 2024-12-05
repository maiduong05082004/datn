<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use DB;
use Schema;
use App\Events\ChatEvent;
use App\Models\User;
use Log;

class MessageController extends Controller
{


    public function getUserChatAdmin(Request $request)
    {
        $adminId = auth()->user()->id; 

        $users = Message::where(function ($query) use ($adminId) {
                $query->where('sender_id', $adminId)
                      ->orWhere('receiver_id', $adminId);
            })
            ->where('sender_id', '!=', $adminId)  // Loại bỏ admin gửi cho chính mình
            ->join('users', 'users.id', '=', 'messages.sender_id')
            ->select('users.id', 'users.name')
            ->distinct() 
            ->get();
    
        return response()->json($users);
    }
    
    


    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'image_url' => 'nullable|image|max:10240', // 10MB max file size
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
    
        // Tạo tin nhắn
        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'image_url' => $image_url,
            'is_read' => false,
        ]);
    
        // Phát sóng sự kiện chat
        broadcast(new ChatEvent($message))->toOthers();

    
        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message,
        ]);
    }
    
    public function markAsRead($messageId)
    {
        $message = Message::find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found',
            ], 404);
        }


        $message->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read',
            'data' => $message,
        ]);
    }


    public function getUserMessages(Request $request, $userId)
    {
        $messages = Message::with(['sender:id,name', 'receiver:id,name']) 
            ->where(function ($query) use ($request, $userId) {
                $query->where('sender_id', $request->user()->id)
                      ->where('receiver_id', $userId)
                      ->orWhere('receiver_id', $request->user()->id)
                      ->where('sender_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->get(); 

        return response()->json($messages);
    }
    
    public function deleteUserAndMessages($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }       
        // Lấy tất cả tin nhắn có liên quan đến người dùng
        $messages = Message::where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                      ->orWhere('receiver_id', $userId);
            })
            ->get();
        
        foreach ($messages as $message) {
            $message->delete();
        }
        $user->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'User and associated messages soft deleted successfully',
        ]);
    }
    
    

    
}