import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import axiosInstance from '@/configs/axios';
import { Spin, Button, Table, message, Input, Tag } from 'antd';
import { useParams } from 'react-router-dom';

type Props = {}

const Comments = (props: Props) => {
  const { id } = useParams(); // Lấy `bill_detail_id` từ params
  const [messageAPI, contextHolder] = message.useMessage();
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});

  const { data: CommentsData, isLoading, refetch } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await axiosInstance.post('http://localhost:8000/api/admins/comment/list', {
        product_id: id,
      });
      return response.data;
    },
  });

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
      messageAPI.error('Có lỗi khi trả lời bình luận');
    },
  });

  const handleReply = (commentId: number) => {
    const content = replyContent[commentId];
    if (content) {
      mutate({ parentId: commentId, content });
    } else {
      messageAPI.error('Vui lòng nhập nội dung trả lời trước khi gửi.');
    }
  };

  const columns = [
    {
      title: 'User ID (Tên người dùng)',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Product ID (Tên sản phẩm và variations)',
      dataIndex: 'product_id',
      key: 'product_id',
      render: (_: any, record: any) => (
        record.product_id
          ? `ID: ${record.product_id}, Size: ${record.variation_value?.size || ''}, Color: ${record.variation_value?.color || ''}`
          : 'Không có thông tin sản phẩm'
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      // render: (_: any, record: any) => (
      //   <div className="flex flex-col space-y-2">
      //     <Input
      //       placeholder="Nhập nội dung trả lời"
      //       value={replyContent[record.comment_id] || ''}
      //       onChange={(e) =>
      //         setReplyContent((prev) => ({
      //           ...prev,
      //           [record.comment_id]: e.target.value,
      //         }))
      //       }
      //     />
      //     <Button
      //       type="primary"
      //       onClick={() => handleReply(record.comment_id)}
      //     >
      //       Trả lời
      //     </Button>
      //   </div>
      // ),
    },
    {
      title: 'Ngày bình luận',
      dataIndex: 'commentDate',
      key: 'commentDate',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Bill Detail ID',
      dataIndex: 'bill_detail_id',
      key: 'bill_detail_id',
      render: (id: number) => (id ? id : 'Không có'),
    },
    {
      title: 'Moderation Status',
      dataIndex: 'moderation_status',
      key: 'moderation_status',
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'green' : 'red'}>
          {status || 'Chưa duyệt'}
        </Tag>
      ),
    },
    {
      title: 'Số sao (Stars)',
      dataIndex: 'stars',
      key: 'stars',
      render: (stars: number) => (stars ? `${stars} ⭐` : 'Chưa đánh giá'),
    },
    {
      title: 'Báo cáo (is_reported)',
      dataIndex: 'is_reported',
      key: 'is_reported',
      render: (reported: boolean) => (reported ? 'Đã báo cáo' : 'Chưa báo cáo'),
    },
    {
      title: 'Hiển thị (is_visible)',
      dataIndex: 'is_visible',
      key: 'is_visible',
      render: (visible: boolean) => (visible ? 'Có' : 'Không'),
    },
  ];

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      {contextHolder}
      <div className="w-full mx-auto px-6 py-8">
        <h2 className="text-center text-xl font-semibold mb-4">LIỆT KÊ COMMENT</h2>
        <Table
          columns={columns}
          dataSource={CommentsData}
          rowKey="comment_id"
          bordered
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} bình luận`,
          }}
        />
      </div>
    </>
  );
}

export default Comments;
