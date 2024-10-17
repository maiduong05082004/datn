import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Spin, message, Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

interface User {
  key: number;
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  date_of_birth: string;
  sex: 'male' | 'female';
}

const UserList: React.FC = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['userManager'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/users');
      return response.data;
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://127.0.0.1:8000/api/admins/users/${id}`);
    },
    onSuccess: () => {
      messageApi.success('Xóa thành công!');
      queryClient.invalidateQueries({ queryKey: ['userManager'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
      messageApi.error(errorMessage);
    },
  });

  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
  }

  const dataSource = users.map((user: User, index: number) => ({
    key: user.id,
    index: index + 1,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.is_active ? 'Active' : 'Inactive',
    dateOfBirth: user.date_of_birth,
    sex: user.sex === 'male' ? 'Nam' : 'Nữ',
    createdAt: new Date(user.created_at).toLocaleString(),
    updatedAt: new Date(user.updated_at).toLocaleString(),
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
      width: 150,
      render: (_: any, user: User) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này không?"
            onConfirm={() => deleteUser.mutate(user.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/updateUser/${user.id}`)}
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
