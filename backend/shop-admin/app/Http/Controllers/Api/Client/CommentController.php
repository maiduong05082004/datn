<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\Comment;
use App\Models\Product;
use App\Models\ReportComment;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $productId = $request->input('product_id');
        $isAdmin = Auth::user()->role === 'admin';
        $ratingData = $this->getProductRating($request);

        $comments = Comment::with([
            'BillDetail.productVariationValue.attributeValue',
            'parentComment',
            'user'
        ])
            ->where('product_id', $productId)
            ->where('is_visible', 1)
            ->paginate(10);

        $commentList = [];
        foreach ($comments as $comment) {
            $userName = $comment->is_anonymous && !$isAdmin ? 'Anonymous' : $comment->user->name;
            $parentComment = $comment->parentComment;
            $isAdminReply = !is_null($comment->parentComment) && $comment->user->is_admin;
            $variationValue = [
                'product_variation_value_id' => $comment->billDetail->productVariationValue->id ?? null,
                'size' => $comment->billDetail->productVariationValue->attributeValue->value ?? null,
                'color' => $comment->billDetail->productVariationValue->productVariation->attributeValue->value ?? null
            ];
            $parentCommentDetails = null;
            if ($comment->parentComment) {
                $parentCommentDetails = [
                    'parent_id' => $parentComment->id,
                    'comment_id' => $comment->id,
                    'content' => $parentComment->content,
                    'bill_detail_id' => $parentComment->bill_detail_id,
                    'product_id' => $parentComment->product_id,
                    'commentDate' => $parentComment->commentDate,
                    'user_name' => $parentComment->user->name,
                ];
            }
            $commentData = [
                'comment_id' => $comment->id,
                'content' => $comment->content,
                'bill_detail_id' => $comment->bill_detail_id,
                'product_id' => $comment->billDetail->product_id ?? null,
                'commentDate' => $comment->commentDate,
                'stars' => $comment->stars,
                'user_name' => $userName,
                'user_id' => $comment->user_id,
                'reported_count' => $comment->reported_count,
                'is_visible' => $comment->is_visible,
                'product_variation_value_id' => $variationValue['product_variation_value_id'],
                'size' => $variationValue['size'],
                'color' => $variationValue['color'],
                'parent_comment' => $parentCommentDetails ? $parentCommentDetails : null,  // Chỉ thêm bình luận cha nếu có
                'reply_comment' => []  // Mảng chứa các bình luận trả lời
            ];
            $replyComments = Comment::with('user')
                ->where('parent_id', $comment->id)
                ->where('is_visible', 1)
                ->get();

            // Thêm các bình luận trả lời vào mảng 'reply_comment' của bình luận chính
            foreach ($replyComments as $reply) {
                $commentData['reply_comment'][] = [
                    'comment_id' => $reply->id,
                    'content' => $reply->content,
                    'bill_detail_id' => $reply->bill_detail_id,
                    'product_id' => $reply->billDetail->product_id ?? null,
                    'commentDate' => $reply->commentDate,
                    'user_name' => $reply->user->name,
                ];
            }
            $commentList[] = $commentData;
            // $commentList[] = [
            //     'comment_id' => $comment->id,
            //     'content' => $comment->content,
            //     'bill_detail_id' => $comment->bill_detail_id,
            //     'product_id' => $comment->billDetail->product_id ?? null,
            //     'commentDate' => $comment->commentDate,
            //     'user_name' => $userName,
            //     'product_variation_value_id' => $variationValue['product_variation_value_id'],
            //     'size' => $variationValue['size'],
            //     'color' => $variationValue['color'],
            //     'parent_comment' => $parentCommentDetails ? [$parentCommentDetails] : null,
            // 'variation_value' => $isAdminReply ? null : [
            //     'product_variation_value_id' => $comment->billDetail->productVariationValue->id ?? null,
            //     'size' => $comment->billDetail->productVariationValue->attributeValue->value ?? null,
            //     'color' => $comment->billDetail->productVariationValue->productVariation->attributeValue->value ?? null,
            // ],
            // 'bill_detail_id' => $isAdminReply ? null : $comment->bill_detail_id,
            // 'product_id' => $isAdminReply ? null : $comment->billDetail->product_id ?? null,
            // 'parent_comment' => $comment->parentComment ? [
            //     'parent_id' => $comment->parentComment->id,
            //     'content' => $comment->parentComment->content,
            //     'user_name' => $comment->parentComment->user->name,
            //     'comment_date' => $comment->parentComment->commentDate,
            // ] : null,
            //     ];
            // }
            // // 1 product,n comment=> list theo product (của user )

            // return response()->json([
            //     'comment_list' => $commentList,
            //     'product_rating' => $ratingData // Đưa thông tin đánh giá vào trong phản hồi
            // ]);
        }
        // $commentList[] = $commentData;
        return response()->json([
            'comment_list' => $commentList,
            'product_rating' => $ratingData // Đưa thông tin đánh giá vào trong phản hồi
        ]);
    }
    // public function __construct()
    // {
    //     // Middleware kiểm tra user đã đăng nhập
    //     $this->middleware('auth');
    // }

    // Kiểm tra xem user đã mua sản phẩm chưa
    private function hasPurchasedProduct($userId, $productId)
    {
        // return Bill::join('bill_details', 'bills.id', '=', 'bill_details.bill_id')
        //     ->where('bills.user_id', $userId)
        //     ->where('bill_details.product_id', $productId)
        //     ->where('bills.status_bill', 'completed')
        //     ->exists();
        return BillDetail::join('bills', 'bill_details.bill_id', '=', 'bills.id')
            ->where('bills.user_id', $userId)
            ->where('bill_details.product_id', $productId)
            ->where('bills.status_bill', Bill::STATUS_DELIVERED) // Chỉ kiểm tra hóa đơn đã thanh toán
            ->select('bill_details.id as bill_detail_id', 'bill_details.product_id', 'bill_details.product_variation_value_id') // Chọn các trường bạn cần
            ->first();
    }

    // API tạo bình luận mới cho sản phẩm đã mua
    public function store(Request $request)
    {
        $userId = Auth::id();
        $productId = $request->input('product_id'); // Lấy product_id từ request
        $billDetailId = $request->input('bill_detail_id');
        $content = $request->input('content'); // Nhận mảng bình luận từ request
        $stars = $request->input('stars', 5);
        $isAnonymous = $request->input('is_anonymous', false);
        // Kiểm tra thông tin từng sản phẩm đã mua
        $productDetails = $this->hasPurchasedProduct($userId, $productId);

        if (!$productDetails) {
            return response()->json(['message' => 'You can only comment on products you have purchased successfully.'], 403);
        }

        // foreach ($comments as $item) {
        //     $billDetailId = $item['bill_detail_id']; // Lấy bill_detail_id từ dữ liệu
        //     $content = $item['content']; // Lấy nội dung bình luận
        //     $stars = $item['stars'] ?? null;

        $existingComment = Comment::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('bill_detail_id', $billDetailId)
            ->first();
        if ($existingComment) {
            return response()->json([
                'message' => 'You have already commented on this product.'
            ], 403);
        }
        // Kiểm tra từng bình luận với bill_detail_id
        $billDetail = BillDetail::find($billDetailId);

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
            'is_anonymous' => $isAnonymous,
        ]);


        return response()->json([
            'message' => 'Comments posted successfully.',
            'comment' => $comment,
        ]);
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

    public function reportComment(Request $request)
    {
        $commentId = $request->input('comment_id');
        $reason = $request->input('reason');
        $userId = Auth::id();

        $comment = Comment::find($commentId);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $product = Product::find($comment->product_id);
        if (!$product) {
            return response()->json(['message' => 'Product not found for this comment.'], 404);
        }

        $existingReport = ReportComment::where('comment_id', $commentId)
            ->where('user_id', $userId)
            ->first();
        if ($existingReport) {
            return response()->json(['message' => 'You have already reported this comment'], 403);
        }
        ReportComment::create([
            'comment_id' => $commentId,
            'user_id' => $userId,
            'reason' => $reason,
        ]);
        $comment->increment('reported_count');

        return response()->json([
            'message' => 'Comment reported successfully',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
            ],
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'reported_count' => $comment->reported_count,
                'is_visible' => $comment->is_visible,
                'reason' => $reason
            ],
        ]);
    }


    // API lấy danh sách bình luận đã duyệt cho một sản phẩm


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

    public function destroy(Request $request)
    {
        $userId = Auth::id();
        $id = $request->input('id');
        $comment = Comment::find($id);

        // Kiểm tra xem bình luận có tồn tại không
        if (!$comment) {
            return response()->json(['message' => 'Comment not found.'], 404);
        }

        // Chỉ cho phép xóa nếu là quản trị viên hoặc là chủ sở hữu của bình luận
        if (Auth::user()->role !== 'admin' && $comment->user_id !== $userId) {
            return response()->json(['message' => 'Permission denied.'], 403);
        }

        // Xóa bình luận
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully.']);
    }

    // public function report(Request $request)
    // {
    //     $id = $request->input('id');
    //     $comment = Comment::find($id);
    //     if (!$comment) {
    //         return response()->json([
    //             'message' => "Comment not found"
    //         ], 404);
    //     }
    //     $comment->reported_count += 1;

    //     if ($comment->reported_count >= 5) {
    //         $comment->is_visible = 0;
    //     }
    //     $comment->save();
    //     return response()->json(['message' => 'Thank for report.', 'reported_count' => $comment->reported_count]);
    // }



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
        // $comment->hide_reason = $request->input('hide_reason') ?? 'Hidden by admin';
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

        $existingReply = Comment::where('parent_id', $parentId)
            ->where('user_id', Auth::id())  // Kiểm tra xem admin đã trả lời chưa
            ->exists();

        if ($existingReply) {
            return response()->json(['message' => 'You have already replied to this comment.'], 400);
        }

        if ($parentComment->user_id == Auth::id()) {
            return response()->json(['message' => 'You cannot reply to your own comment.'], 400);
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
