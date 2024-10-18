import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Spin, message, Button, Popconfirm, Space, Image } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

type Category = {
  id: number;
  parent_id: number | null;
  name: string;
  status: boolean;
  image: string | null;
  children_recursive: Category[];
};

const ListCategories: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch all categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  // Mutation to delete category
  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://127.0.0.1:8000/api/admins/categories/${id}`);
    },
    onSuccess: () => {
      messageApi.success('Đã xóa danh mục thành công');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
      messageApi.error(errorMessage);
    },
  });

  // Helper function to get category name by ID
  const getCategoryNameById = (id: number | null): string | null => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : '';
  };

  // Convert recursive children to tree data
  const convertToTreeData = (categories: Category[]): Category[] => {
    return categories.map((category) => ({
      ...category,
      children:
        category.children_recursive.length > 0
          ? convertToTreeData(category.children_recursive)
          : undefined,
    }));
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parent_id: number | null) => getCategoryNameById(parent_id),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Hoạt động' : 'Không hoạt động'),
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string | null, record: Category) =>
        record.parent_id === null && image ? (
          <Image
            width={90}
            height={90}
            src={image}
            alt="Category Image"
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : null,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, category: Category) => (
        <Space size="middle">
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc muốn xóa danh mục này không?"
            onConfirm={() => deleteCategory(category.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/updateCategories/${category.id}`)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <Spin tip="Đang tải danh mục..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/addCategories')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Thêm danh mục
          </Button>
        </div>
        <Table
          dataSource={convertToTreeData(categories)}
          columns={columns}
          rowKey={(record) => record.id}
          bordered
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} danh mục`,
          }}
        />
      </div>
    </>
  );
};

export default ListCategories;
