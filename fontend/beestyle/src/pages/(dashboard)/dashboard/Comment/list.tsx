import React from 'react';
import { Table, Button, Popconfirm, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

type Comment = {
  id: number;
  username: string;
  productId: string;
  content: string;
  date: string;
};

const ListComments: React.FC = () => {
  const navigate = useNavigate();

  // Giả lập dữ liệu bình luận
  const comments: Comment[] = [
    {
      id: 1,
      username: 'Người dùng 1',
      productId: 'ABC123',
      content: 'Bình luận đầu tiên.',
      date: '28/09/2024',
    },
    {
      id: 2,
      username: 'Người dùng 2',
      productId: 'DEF456',
      content: 'Bình luận thứ hai.',
      date: '29/09/2024',
    },
  ];

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedComment, setSelectedComment] = React.useState<Comment | null>(null);

  // Mở modal hiển thị chi tiết bình luận
  const handleViewDetails = (comment: Comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  // Định nghĩa cột bảng
  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Nội dung bình luận',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ngày bình luận',
      dataIndex: 'date',
      key: 'date',
    },
    // {
    //   title: 'Hành động',
    //   key: 'action',
    //   render: (_: any, comment: Comment) => (
    //     <Space size="middle" className="flex justify-around">
    //       <Button
    //         type="default"
    //         icon={<EditOutlined />}
    //         onClick={() => navigate(`/admin/editComment/${comment.id}`)}
    //       />
    //       <Popconfirm
    //         title="Xóa bình luận"
    //         description="Bạn có chắc muốn xóa bình luận này không?"
    //         okText="Có"
    //         cancelText="Không"
    //       >
    //         <Button type="primary" danger icon={<DeleteOutlined />} />
    //       </Popconfirm>
    //       <Button type="link" onClick={() => handleViewDetails(comment)}>
    //         Xem chi tiết
    //       </Button>
    //     </Space>
    //   ),
    // },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      render: (_: any, comment: Comment) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/updateUser/${comment.id}`)}
          />
          <Popconfirm
            title="Xóa bình luận"
            description="Bạn có chắc muốn xóa bình luận này không?"
            onConfirm={() => console.log('Xóa bình luận', comment.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button type="link" onClick={() => handleViewDetails(comment)}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Thêm bình luận
          </Button>
        </div>
        <Table
          dataSource={comments}
          columns={columns}
          rowKey={(record) => record.id}
          bordered
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} bình luận`,
          }}
        />
      </div>

      {/* Modal hiển thị chi tiết */}
      {selectedComment && (
        <Modal
          title={`Chi tiết bình luận`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>
              Đóng
            </Button>,
          ]}
        >
          <p><strong>Tên người dùng:</strong> {selectedComment.username}</p>
          <p><strong>Product ID:</strong> {selectedComment.productId}</p>
          <p><strong>Nội dung:</strong> {selectedComment.content}</p>
          <p><strong>Ngày:</strong> {selectedComment.date}</p>
        </Modal>
      )}
    </>
  );
};

export default ListComments;
