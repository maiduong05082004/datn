import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import axiosInstance from '@/configs/axios';
import { Spin, Button, message, Input, Table, Tag, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import { EyeInvisibleOutlined, HddOutlined } from '@ant-design/icons';

type Props = {};

interface ReplyComment {
  comment_id: number;
  content: string;
  commentDate: string;
  user_name: string;
}

interface Comment {
  comment_id: number;
  user_id: number;
  content: string;
  commentDate: string;
  user_name: string;
  product_id?: number;
  size?: string;
  color?: string;
  reported_count?: number;
  is_reported?: boolean;
  is_visible?: boolean;
  moderation_status?: string;
  bill_detail_id?: number;
  stars?: number;
  reply_comment: ReplyComment[];
}

const Comments = (props: Props) => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [messageAPI, contextHolder] = message.useMessage();
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({}); // Quản lý nội dung trả lời
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);

  // Fetch danh sách bình luận
  const { data: CommentsData, isLoading, refetch } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await axiosInstance.post('http://localhost:8000/api/admins/comment/list', {
        product_id: id,
      });
      return response.data.comment_list;
    },
  });

  const { data: ProductData } = useQuery({
    queryKey: ['detailProduct', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://localhost:8000/api/admins/products/${id}`);
      return response?.data?.data || {};
    },
  });

  const { mutate: hideComment } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.post('http://localhost:8000/api/admins/comment/hide', {
        id: id,
      });
      return response.data;
    },
    onSuccess: () => {
      messageAPI.success('Ẩn bình luận thành công');
      refetch();
    },
    onError: () => {
      messageAPI.error('Lỗi khi ẩn bình luận');
    },
  });
  const { mutate: manageUser } = useMutation({
    mutationFn: async (user_id: number) => {
      const response = await axiosInstance.post('http://localhost:8000/api/admins/comment/manageUser', {
        user_id: user_id,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.message === 'User is in good standing.') {
        messageAPI.info('Người dùng đang ở trạng thái tốt. Không cần khóa.');
      } else {
        messageAPI.success('Người dùng đã bị khóa thành công!');
      }
      refetch(); 
    },
    onError: () => {
      messageAPI.error('Lỗi khi khóa người dùng.');
    },
  });

  // Báo cáo 
  const { mutate: reportComment } = useMutation({
    mutationFn: async ({ comment_id, reason }: { comment_id: number; reason: string }) => {
      const response = await axiosInstance.post('http://localhost:8000/api/admins/comment/report', {
        comment_id,
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      messageAPI.success('Báo cáo bình luận thành công');
      refetch();
      setIsReportModalVisible(false);
      setReportReason('');
    },
    onError: () => {
      messageAPI.error('Lỗi khi báo cáo bình luận');
    },
  });
  const showReportModal = (commentId: number) => {
    setCurrentCommentId(commentId);
    setIsReportModalVisible(true);
  };

  const handleReport = () => {
    if (!currentCommentId || !reportReason) {
      messageAPI.error('Vui lòng nhập lý do báo cáo.');
      return;
    }
    reportComment({ comment_id: currentCommentId, reason: reportReason });
  };

  const { mutate } = useMutation({
    mutationFn: async ({ parentId, content }: { parentId: number; content: string }) => {
      const response = await axiosInstance.post('http://localhost:8000/api/admins/comment/reply', {
        parent_id: parentId,
        content: content,
      });
      return response.data;
    },
    onSuccess: () => {
      messageAPI.success('Trả lời bình luận thành công');
      refetch();
    },
    onError: () => {
      messageAPI.error('Admin đã trả lời rồi');
    },
  });
  // Xử lý trả lời bình luận
  const handleReply = (commentId: number) => {
    const content = replyContent[commentId];
    if (content) {
      mutate({ parentId: commentId, content });
      setReplyContent({ ...replyContent, [commentId]: '' });
    } else {
      messageAPI.error('Vui lòng nhập nội dung trả lời trước khi gửi.');
    }
  };

  const filteredComments = CommentsData?.filter((comment: Comment) => {
    const isReply = CommentsData.some((item: any) =>
      item.reply_comment.some((reply: any) => reply.comment_id === comment.comment_id)
    );
    return !isReply;
  });

  const columns: ColumnsType<Comment> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Người bình luận',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Thông tin sản phẩm',
      key: 'product_info',
      render: () => (
        <div>
          <p><strong>Tên sản phẩm:</strong> {ProductData?.name || 'N/A'}</p>
          <p><strong>Giá:</strong> {ProductData?.price ? `${ProductData.price} VNĐ` : 'N/A'}</p>
          <p><strong>Danh mục:</strong> {ProductData?.category_name || 'N/A'}</p>
        </div>
      ),
    },
    {
      title: 'Nội dung bình luận và trả lời',
      key: 'content_with_replies',
      render: (_, record) => (
        <div className="p-4 bg-white rounded-lg shadow-md">
          {/* Phần nội dung bình luận chính */}
          <p className="text-gray-800 font-semibold">
            <strong>Nội dung:</strong> {record.content}
          </p>

          {/* Phần trả lời nếu có */}
          {record.reply_comment.length > 0 && (
            <div className="pl-4 border-l-2 border-gray-300 mt-4">
              <strong className="block text-gray-600">Trả lời:</strong>
              {record.reply_comment.map(reply => (
                <div
                  key={reply.comment_id}
                  className="mt-2 bg-gray-100 p-2 rounded-md shadow-inner"
                >
                  <p className="text-sm text-gray-800">
                    <strong>{reply.user_name}:</strong> {reply.content}
                  </p>
                  <p className="text-xs text-gray-500 italic">{reply.commentDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* Input và nút gửi trả lời */}
          <Input
            placeholder="Nhập nội dung trả lời..."
            value={replyContent[record.comment_id] || ''}
            onChange={(e) =>
              setReplyContent({ ...replyContent, [record.comment_id]: e.target.value })
            }
            className="mt-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            type="primary"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2"
            onClick={() => handleReply(record.comment_id)}
          >
            Gửi trả lời
          </Button>
        </div>
      ),
    },
    {
      title: 'Số lần báo cáo',
      dataIndex: 'reported_count',
      key: 'reported_count',
      render: (count, record) => (
        <div className="flex items-center space-x-2">
          <Tag
            color={count > 0 ? 'red' : 'green'}
            style={{ fontSize: '16px', padding: '6px 12px', borderRadius: '8px' }}
          >
            {count || 0}
          </Tag>

          <Button type="default" danger onClick={() => showReportModal(record.comment_id)}>
            Báo cáo
          </Button>
        </div>
      ),
    },
    {
      title: 'Trạng thái hiển thị',
      dataIndex: 'is_visible',
      key: 'is_visible',
      render: (isVisible) =>
        <Tag
          color={isVisible ? 'green' : 'red'}
          style={{
            fontSize: '16px', // Tăng kích thước chữ
            padding: '6px 12px', // Tăng khoảng cách bên trong
            borderRadius: '8px', // Bo góc
            display: 'inline-block', // Giữ thẻ hiển thị gọn gàng
            textAlign: 'center', // Căn giữa nội dung
          }}
        >
          {isVisible ? 'Hiển thị' : 'Ẩn'}
        </Tag>
    },
    {
      title: 'Số sao',
      dataIndex: 'stars',
      key: 'stars',
      render: (stars) => <Tag
      color="gold"
      style={{
        fontSize: '16px', // Tăng kích thước chữ
        padding: '6px 12px', // Tăng khoảng cách bên trong
        borderRadius: '8px', // Bo tròn góc
        display: 'inline-flex', // Giữ nội dung tag trong một hàng
        alignItems: 'center', // Căn giữa nội dung theo chiều dọc
      }}
    >
      {stars || 0} ⭐
    </Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="default"
            danger
            onClick={() => hideComment(record.comment_id)}
            icon={<EyeInvisibleOutlined />}
          >
            Ẩn
          </Button>
    
          {/* Nút Khóa User */}
          <Button
            type="default"
            onClick={() => manageUser(record.user_id)}
            icon={<HddOutlined />}
          >
            Khóa User
          </Button>
        </div>
      ),
    }
    

  ];

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      {contextHolder}
      <div className="w-full mx-auto px-6 py-8">
        <Table
          columns={columns}
          dataSource={filteredComments}
          rowKey="comment_id"
          bordered
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} bình luận`,
          }}
        />
        <Modal
          title="Báo cáo bình luận"
          visible={isReportModalVisible}
          onOk={handleReport}
          onCancel={() => setIsReportModalVisible(false)}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do báo cáo..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </Modal>
      </div>
      
    </>
  );
};

export default Comments;
