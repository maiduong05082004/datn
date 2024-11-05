<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillDentail;
use App\Models\Comment;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct()
    {
        // Middleware kiểm tra user đã đăng nhập
        $this->middleware('auth');
    }

    // Kiểm tra xem user đã mua sản phẩm chưa
    private function hasPurchasedProduct($userId, $productId)
    {
        // return Bill::join('bill_dentails', 'bills.id', '=', 'bill_dentails.bill_id')
        //     ->where('bills.user_id', $userId)
        //     ->where('bill_dentails.product_id', $productId)
        //     ->where('bills.status_bill', 'completed')
        //     ->exists();
        return BillDentail::join('bills', 'bill_dentails.bill_id', '=', 'bills.id')
            ->where('bills.user_id', $userId)
            ->where('bill_dentails.product_id', $productId)
            ->where('bills.status_bill', 'completed') // Chỉ kiểm tra hóa đơn đã thanh toán
            ->select('bill_dentails.id as bill_detail_id', 'bill_dentails.product_id', 'bill_dentails.product_variation_value_id') // Chọn các trường bạn cần
            ->first();
    }

    // API tạo bình luận mới cho sản phẩm đã mua
    public function store(Request $request)
    {
        $userId = Auth::id();
        $productId = $request->input('product_id'); // Lấy product_id từ request
        $comments = $request->input('comments'); // Nhận mảng bình luận từ request

        // Kiểm tra thông tin từng sản phẩm đã mua
        $productDetails = $this->hasPurchasedProduct($userId, $productId);

        if (!$productDetails) {
            return response()->json(['message' => 'You can only comment on products you have purchased successfully.'], 403);
        }

        foreach ($comments as $item) {
            $billDetailId = $item['bill_detail_id']; // Lấy bill_detail_id từ dữ liệu
            $content = $item['content']; // Lấy nội dung bình luận
            $stars = $item['stars'] ?? null;

            // Kiểm tra từng bình luận với bill_detail_id
            $billDetail = BillDentail::find($billDetailId);

            if (!$billDetail || $billDetail->product_id !== $productDetails->product_id) {
                return response()->json(['message' => 'Invalid bill detail for the product.'], 404);
            }

            // Tạo bình luận mới
            $comment = Comment::create([
                'user_id' => $userId,
                'product_id' => $billDetail->product_id,
                'bill_detail_id' => $billDetailId, // Lưu bill_detail_id
                'content' => $content,
                'stars' => $stars,
                'commentDate' => now(),
                'is_visible' => 1, // Hiển thị ngay lập tức
                'moderation_status' => Comment::STATUS_APPROVED,
                'is_reported' => 0,
                'reported_count' => 0,
            ]);
        }

        return response()->json(['message' => 'Comments posted successfully.']);
    }

    // API Tính trung bình đánh giá
    public function getProductRating(Request $request)
    {
        $productId = $request->input('product_id');
        // Tính trung bình số sao của sản phẩm dựa trên các bình luận có `stars`
        $averageRating = Comment::where('product_id', $productId)
            ->whereNotNull('stars')
            ->avg('stars');
        $averageRating = round($averageRating, 1); // Làm tròn đến 1 chữ số thập phân

        // Tổng số đánh giá
        $totalRatings = Comment::where('product_id', $productId)
            ->whereNotNull('stars')
            ->count();

        return response()->json([
            'average_rating' => $averageRating,
            'total_ratings' => $totalRatings
        ]);
    }


    // API lấy danh sách bình luận đã duyệt cho một sản phẩm
    public function index(Request $request)
    {
        $productId = $request->input('product_id');

        $comments = Comment::with(['BillDentail.productVariationValue.attributeValue'])
            ->where('product_id', $productId)
            ->where('is_visible', 1)
            ->paginate(10);

        $commentList = [];
        foreach ($comments as $comment) {
            $commentList[] = [
                'comment_id' => $comment->id,
                'content' => $comment->content,
                'bill_detail_id' => $comment->bill_detail_id,
                'product_id' => $comment->billDentail->product_id ?? null,
                'commentDate' => $comment->commentDate,
                'variation_value' => [
                    'product_variation_value_id' => $comment->billDentail->productVariationValue->id ?? null,
                    'size' => $comment->billDentail->productVariationValue->attributeValue->value ?? null,
                    'color' => $comment->billDentail->productVariationValue->productVariation->attributeValue->value ?? null,
                ],
            ];
        }

        return response()->json($commentList);
    }

    // API cập nhật bình luận
    public function update(Request $request)
    {
        $userId = Auth::id();
        $id = $request->input('id');
        $comment = Comment::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$comment) {
            return response()->json(['message' => 'Comment not found or permission denied.'], 404);
        }

        // $dataComment = [
        //     'content' => $comment->content,
        //     'product_id' => $comment->product_id,
        //     'product_variation_value_id' => $comment->product_variation_value_id 
        // ];

        // return response()->json([
        //     'message' => 'Comment updated successfully.',
        //     'comment' => $comment,
        //     'data' => $dataComment
        // ]);
        // Cập nhật nội dung bình luận
        $content = $request->input('content');
        if (strlen($content) > 500) {
            return response()->json([
                'message' => "Nội dung bình luận quá dài"
            ], 400);
        }
        $comment->content = $content;
        // Lưu các thay đổi
        $comment->save();

        return response()->json(['message' => 'Comment updated successfully.', 'comment' => $comment]);
    }

    public function report(Request $request)
    {
        $id = $request->input('id');
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json([
                'message' => "Comment not found"
            ], 404);
        }
        $comment->reported_count += 1;

        if ($comment->reported_count >= 5) {
            $comment->is_visible = 0;
        }
        $comment->save();
        return response()->json(['message' => 'Thank for report.', 'reported_count' => $comment->reported_count]);
    }



    // API admin duyệt bình luận
    public function approve(Request $request)
    {
        $id = $request->input('id');
        $moderation_status = $request->input('moderation_status');
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found.'], 404);
        }

        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Only admin can approve comments.'], 403);
        }

        if ($moderation_status === Comment::STATUS_APPROVED) {
            $comment->moderation_status = Comment::STATUS_APPROVED;
            $comment->is_visible  = 1;
        } elseif ($moderation_status === Comment::STATUS_REJECTED) {
            $comment->moderation_status = Comment::STATUS_REJECTED;
            $comment->is_visible = 0;
        } else {
            return response()->json(['message' => 'Trạng thái không hợp lệ'], 400);
        }
        $comment->save();

        return response()->json(['message' => 'Comment approved successfully.', 'comment' => $comment]);
    }

    public function hideComment(Request $request)
    {
        $id = $request->input('id');
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json([
                'message' => 'Comment not found',
            ], 404);
        }
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'message' => 'Only admin can hide comments',
            ], 404);
        }
        $comment->is_visible = 0;
        $comment->hide_reason = $request->input('hide_reason') ?? 'Hidden by admin';
        $comment->save();
        return response()->json([
            'message' => 'Comment hide successfully',
        ]);
    }

    public function manageUser(Request $request)
    {
        $userId = $request->input('user_id');
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $reportedCount = Comment::where('user_id', $userId)->where('is_reported', 1)->count();
        if ($reportedCount >= 5) {
            $user->is_active = 0;
            $user->save();
            return response()->json(['message' => 'User has been locked due to excessive reports.']);
        }

        return response()->json(['message' => 'User is in good standing.']);
    }


    // API cho phép admin và user trả lời bình luận
    public function reply(Request $request)
    {
        $parentId = $request->input('parent_id');
        $parentComment = Comment::find($parentId);

        if (!$parentComment || $parentComment->is_visible == 0) {
            return response()->json(['message' => 'Parent comment not found or not approved.'], 404);
        }

        if (Auth::user()->role !== 'admin' && Auth::id() !== $parentComment->user_id) {
            return response()->json(['message' => 'Permission denied.'], 403);
        }

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'product_id' => $parentComment->product_id,
            'content' => $request->input('content'),
            'commentDate' => now(),
            'is_visible' => 1,
            'moderation_status' => Comment::STATUS_APPROVED,
            'parent_id' => $parentId,
        ]);

        return response()->json(['message' => 'Reply submitted for approval.', 'comment' => $comment]);
    }
}
