import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import instance from '@/configs/axios';
import { Spin, Button, message, Input, Table, Tag, Modal, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import { EyeInvisibleOutlined, HddOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import TabPane from 'antd/es/tabs/TabPane';

type Props = {};

interface ReplyComment {
  comment_id: number;
  content: string;
  commentDate: string;
  user_name: string;
}
type Report = {
  user_name: string;
  reason: string;
  reported_at: string;
};

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
  const { id } = useParams();
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({}); // Quản lý nội dung trả lời
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportData, setReportData] = useState<Report[]>([]);

  // Fetch danh sách bình luận
  const { data: CommentsData, isLoading, refetch } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await instance.post('api/admins/comment/list', {
        product_id: id,
      });
      return response.data.comment_list;
    },
  });

  const { data: ProductData } = useQuery({
    queryKey: ['detailProduct', id],
    queryFn: async () => {
      const response = await instance.get(`api/admins/products/${id}`);
      return response?.data?.data || {};
    },
  });

  const { mutate: hideComment } = useMutation({
    mutationFn: async (id: number) => {
      const response = await instance.post('api/admins/comment/hide', {
        id: id,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Ẩn bình luận thành công');
      refetch();  
    },
    onError: () => {
      toast.error('Ẩn bình luận thất bại!');
    },
  });
  const { mutate: toggleCommentVisibility } = useMutation({
    mutationFn: async ({ id, is_visible }: { id: number; is_visible: number }) => {
      const endpoint = is_visible === 1
        ? 'api/admins/comment/unhide' 
        : 'api/admins/comment/hide';  

      const response = await instance.post(endpoint, { id });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Cập nhật bình luận thành công');
      refetch(); 
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error('Cập nhật trạng thái thất bại!');
    },
  });




  const { mutate: fetchReports } = useMutation({
    mutationFn: async (comment_id: number) => {
      const response = await instance.post('api/admins/comment/list-report', {
        comment_id,
      });
      return response.data.reports;
    },
    onSuccess: (data) => {
      setReportData(data);
      setIsReportModalVisible(true);
    },
    onError: () => {
      toast.error('Không thể lấy dữ liệu báo cáo.');
    },
  });
  const showReportModal = (commentId: number) => {
    setCurrentCommentId(commentId);
    fetchReports(commentId);
  };


  // const { mutate: reportComment } = useMutation({
  //   mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
  //     const response = await instance.post('api/admins/comment/report', {
  //       id,
  //       reason,
  //     });
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     messageAPI.success('Báo cáo bình luận thành công');
  //     refetch();
  //     setIsReportModalVisible(false);
  //     if (currentCommentId !== null) {
  //       setReportReasons((prev: any) => ({ ...prev, [currentCommentId]: '' })); 
  //     }
  //   },
  //   onError: () => {
  //     messageAPI.error('Lỗi khi b��o cáo bình luận');
  //   },
  // });
  // const showReportModal = (commentId: number) => {
  //   setCurrentCommentId(commentId);
  //   setIsReportModalVisible(true);
  // };

  // const handleReport = () => {
  //   if (!currentCommentId || !reportReasons[currentCommentId]?.trim()) {
  //     messageAPI.error('Vui lòng nhập lý do báo cáo.');
  //     return;
  //   }

  //   reportComment({
  //     id: currentCommentId,
  //     reason: reportReasons[currentCommentId],
  //   });
  // };

  const { mutate } = useMutation({
    mutationFn: async ({ parentId, content }: { parentId: number; content: string }) => {
      const response = await instance.post('api/admins/comment/reply', {
        parent_id: parentId,
        content: content,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Trả lời bình luận thành công');
      refetch();
      setIsReplyModalVisible(false);
    },
    onError: () => {
      toast.error('Admin đã trả lời rồi');
    },
  });

  const showReplyModal = (commentId: number) => {
    setCurrentCommentId(commentId);
    setIsReplyModalVisible(true);
  };



  const handleReply = () => {
    if (currentCommentId !== null && replyContent[currentCommentId]?.trim()) {
      mutate({ parentId: currentCommentId, content: replyContent[currentCommentId] });
    } else {
      toast.error('Vui lòng nhập nội dung trả lời trước khi gửi.');
    }
  };

  const filteredHiddenComments = CommentsData?.filter(
    (comment: Comment) => Number(comment.is_visible) === 0 || comment.is_visible === false
  );

  const filteredVisibleComments = CommentsData?.filter(
    (comment: Comment) => Number(comment.is_visible) === 1 || comment.is_visible === true
  );


  const columns: ColumnsType<Comment> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: "50px",
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Người bình luận',
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center',
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
      width: '20%',
      render: (_, record) => (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-800 font-semibold">
            <strong>Nội dung:</strong> {record.content}
          </p>
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
    
          {!record.reply_comment.some(reply => reply.user_name === 'admin') && (
            <Button
              type="default"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2"
              onClick={() => showReplyModal(record.comment_id)}
            >
              Trả lời
            </Button>
          )}
        </div>
      ),
    },

    {
      title: 'Số lần báo cáo',
      dataIndex: 'reported_count',
      align: 'center',
      key: 'reported_count',
      render: (count, record) => (
        <div className="flex items-center justify-center gap-2">
          <Tag
            color={count > 0 ? 'red' : 'green'}
            style={{
              fontSize: '16px',
              padding: '6px 12px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            {count || 0}
          </Tag>
          {count > 0 && (
            <Button
              type="default"
              danger
              onClick={() => showReportModal(record.comment_id)}
            >
              Xem Chi Tiết
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái hiển thị',
      dataIndex: 'is_visible',
      key: 'is_visible',
      align: 'center',
      render: (isVisible) =>
        <Tag
          color={isVisible ? 'green' : 'red'}
          style={{
            fontSize: '16px',
            padding: '6px 12px',
            borderRadius: '8px',
            display: 'inline-block',
            textAlign: 'center',
          }}
        >
          {isVisible ? 'Hiển thị' : 'Ẩn'}
        </Tag>
    },
    {
      title: 'Số sao',
      dataIndex: 'stars',
      align: 'center',
      key: 'stars',
      render: (stars) => <Tag
        color="gold"
        style={{
          fontSize: '16px',
          padding: '6px 12px',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {stars || 0} ⭐
      </Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      width: "50px",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => toggleCommentVisibility({ id: record.comment_id, is_visible: 1 })}>
            Hiện
          </Button>

        </div>
      ),
    }

  ];

  const columns2: ColumnsType<Comment> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: "50px",
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Người bình luận',
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center',
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
      width: '20%',
      render: (_, record) => (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-800 font-semibold">
            <strong>Nội dung:</strong> {record.content}
          </p>
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

          {!record.reply_comment.some(reply => reply.user_name === 'admin') && (
            <Button
              type="default"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2"
              onClick={() => showReplyModal(record.comment_id)}
            >
              Trả lời
            </Button>
          )}
        </div>
      ),
    },

    {
      title: 'Số lần báo cáo',
      dataIndex: 'reported_count',
      align: 'center',
      key: 'reported_count',
      render: (count, record) => (
        <div className="flex items-center justify-center gap-2">
          <Tag
            color={count > 0 ? 'red' : 'green'}
            style={{
              fontSize: '16px',
              padding: '6px 12px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            {count || 0}
          </Tag>
          {count > 0 && (
            <Button
              type="default"
              danger
              onClick={() => showReportModal(record.comment_id)}
            >
              Xem Chi Tiết
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái hiển thị',
      dataIndex: 'is_visible',
      key: 'is_visible',
      align: 'center',
      render: (isVisible) =>
        <Tag
          color={isVisible ? 'green' : 'red'}
          style={{
            fontSize: '16px',
            padding: '6px 12px',
            borderRadius: '8px',
            display: 'inline-block',
            textAlign: 'center',
          }}
        >
          {isVisible ? 'Hiển thị' : 'Ẩn'}
        </Tag>
    },
    {
      title: 'Số sao',
      dataIndex: 'stars',
      align: 'center',
      key: 'stars',
      render: (stars) => <Tag
        color="gold"
        style={{
          fontSize: '16px',
          padding: '6px 12px',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {stars || 0} ⭐
      </Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      width: "50px",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            danger
            onClick={() => toggleCommentVisibility({ id: record.comment_id, is_visible: 0 })}>
            Ẩn
          </Button>
        </div>
      ),
    }

  ];

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <ToastContainer />
      <div className="w-full mx-auto px-6 py-8">
        <ToastContainer />
        <Tabs defaultActiveKey="1">
          <TabPane tab="Bình Luận Công Khai" key="2">
            <Table
              columns={columns2}
              dataSource={filteredVisibleComments}
              rowKey="comment_id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Bình Luận Ẩn" key="1">
            <Table
              columns={columns}
              dataSource={filteredHiddenComments}
              rowKey="comment_id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

        </Tabs>
        {/* <Modal
          title="Báo cáo bình luận"
          visible={isReportModalVisible}
          onOk={handleReport}
          onCancel={() => setIsReportModalVisible(false)}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do báo cáo..."
            value={currentCommentId !== null ? reportReasons[currentCommentId] || '' : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (currentCommentId !== null) {
                setReportReasons((prev) => ({
                  ...prev,
                  [currentCommentId]: value,
                }));
              }
            }}
          />
        </Modal> */}

        <Modal
          title="Trả lời bình luận"
          visible={isReplyModalVisible}
          onOk={handleReply}
          onCancel={() => setIsReplyModalVisible(false)}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập nội dung trả lời..."
            value={currentCommentId !== null ? replyContent[currentCommentId] || '' : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (currentCommentId !== null) {
                setReplyContent((prev) => ({
                  ...prev,
                  [currentCommentId]: value,
                }));
              }
            }}
          />
        </Modal>

        <Modal
          title="Chi Tiết Báo Cáo"
          visible={isReportModalVisible}
          onCancel={() => setIsReportModalVisible(false)}
          footer={null}
        >
          <Table
            dataSource={reportData}
            columns={[
              {
                title: 'Người báo cáo',
                dataIndex: 'user_name',
                key: 'user_name',
              },
              {
                title: 'Lý do',
                dataIndex: 'reason',
                key: 'reason',
              },
              {
                title: 'Thời gian báo cáo',
                dataIndex: 'reported_at',
                key: 'reported_at',
                render: (text) => new Date(text).toLocaleString(),
              },
            ]}
            rowKey={(record, index) => index !== undefined ? index.toString() : record.user_name}
            pagination={false}
            bordered
          />
        </Modal>

      </div>

    </>
  );
};

export default Comments;
