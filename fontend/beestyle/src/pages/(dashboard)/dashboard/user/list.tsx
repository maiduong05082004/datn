import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Spin, message, Button, Space } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'user' | 'moderator';
  is_active: boolean;
  date_of_birth: string | null;
  sex: 'male' | 'female' | null;
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
      const response = await axios.get('http://127.0.0.1:8000/api/admins/users');
      return response.data;
    },
  });

  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
  }

  const dataSource = userManager.map((item: User, index: number) => ({
    key: item.id,
    index: index + 1,
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role,
    isActive: item.is_active ? 'Active' : 'Inactive',
    dateOfBirth: item.date_of_birth,
    sex: item.sex === 'male' ? 'Nam' : 'Nữ',
    createdAt: new Date(item.created_at).toLocaleString(),
    updatedAt: new Date(item.updated_at).toLocaleString(),
  }));

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Giới tính',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/viewUser/${record.id}`)} // View details navigation
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/updateUser/${record.id}`)} // Edit navigation
          />
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
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/addUser')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Thêm mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
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
