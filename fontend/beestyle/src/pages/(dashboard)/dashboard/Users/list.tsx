import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Spin, message, Button, Space } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import instance from '@/configs/axios';
import SearchComponent from '@/components/ui/search';
import { ColumnsType } from 'antd/es/table';

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
  // const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('');
  const sortOptions = ['name', 'email'];
  const sortOptionsName = ['tên', 'email'];

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      return;
    }
    setSearchQuery(query);
  };

  const handleSortChange = (sortKey: string) => {
    setSortKey(sortKey);
  };

  const { data: userManager = [], isLoading } = useQuery<User[]>({
    queryKey: ['userManager'],
    queryFn: async () => {
      const response = await instance.get('api/admins/users');
      return response.data;
    },
  });

  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
  }

  const filteredUsers = userManager.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortKey === 'name') {
      return a.name.localeCompare(b.name); 
    } else if (sortKey === 'email') {
      return a.email.localeCompare(b.email); 
    }
    return 0;
  });

  const dataSource = sortedUsers.map((user: any, index: any) => ({
    key: user.id, ...user,
    index: index + 1,
  }));

  const columns: ColumnsType<User> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      align: 'center',
      width: "120px",
    },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (isActive: boolean) => (isActive ? 'Hoạt động' : 'Không hoạt động'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <>
      <div className="w-full mx-auto p-5">
        <SearchComponent 
          items={filteredUsers} 
          onSearch={handleSearch} 
          onSortChange={handleSortChange} 
          sortOptions={sortOptions}
          sortOptionsName={sortOptionsName}
        />
        {/* <div className="flex justify-between items-center mb-6">
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/dashboard/user/add')}
          >
            Thêm mới
          </Button>
        </div> */}
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          rowKey="id"
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
          style={{ textAlign: 'center' }}  // Căn giữa toàn bộ nội dung bảng
        />

      </div>
    </>
  );
};

export default UserList;
