import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Spin, message, Button, Space } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '@/configs/axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'user' | 'moderator';
  is_active: boolean;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

const UserList: React.FC = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: userManager = [], isLoading } = useQuery<User[]>({
    queryKey: ['userManager'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/users');
      return response.data;
    },
  });

  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
  }

  const dataSource = userManager.map((user: any, index: any) => ({
    key: user.id, ...user,
    index: index + 1,
  }));

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (isActive ? 'Hoạt động' : 'Không hoạt động'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/dashboard/user/detail/${record.id}`)}
            className='rounded-full'
          >
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/dashboard/user/update/${record.id}`)}
            className='rounded-full'
          >
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/dashboard/user/add')}
          >
            Thêm mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          rowKey="id"
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
        />
      </div>
    </>
  );
};

export default UserList;
