import React from 'react';
import AxiosInstance from '@/configs/axios';
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

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await AxiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id: number) => {
      await AxiosInstance.delete(`http://127.0.0.1:8000/api/admins/categories/${id}`);
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

  const handleDelete = (category: Category) => {
    if (category.children_recursive.length > 0) {
      messageApi.warning('Không thể xóa danh mục này. Vui lòng xóa các danh mục con trước.');
      return;
    }
    deleteCategory(category.id);
  };

  const getCategoryNameById = (id: number | null): string | null => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : '';
  };

  const convertToTreeData = (categories: Category[]): Category[] => {
    return categories.map((category) => ({
      ...category,
      children: category.children_recursive.length
        ? convertToTreeData(category.children_recursive)
        : undefined,
    }));
  };

  const getImageSource = (image: string | null) => {
    if (!image) return undefined;
    return image.startsWith('http')
      ? image
      : `http://127.0.0.1:8000/storage/${image}`;
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
      render: (image: string | null) =>
        image ? (
          <Image
            width={90}
            height={90}
            src={getImageSource(image)}
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
          <Button
            type="default"
            className='rounded-full'
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/dashboard/category/update/${category.id}`)}
          />
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc muốn xóa danh mục này không?"
            onConfirm={() => handleDelete(category)}
            okText="Có"
            cancelText="Không"
          >
            <Button className='rounded-full' type="default" danger icon={<DeleteOutlined />} />
          </Popconfirm>
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
      <div className="w-full mx-auto p-5">
        <div className="flex justify-between items-center mb-6">
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/dashboard/category/add')}
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
