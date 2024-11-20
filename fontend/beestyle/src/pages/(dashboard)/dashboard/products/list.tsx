import React, { useState } from 'react';
import { Table, message, Button, Image, Tag, Modal, Popconfirm, Spin, Tooltip } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import AxiosInstance from '@/configs/axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
  input_day: string;
  category_name: string;
  group: {
    name: string;
  } | null;
  variations: Variation[];
}

interface Variation {
  id: number;
  stock: number;
  attribute_value_image_variant: {
    value: string;
    image_path: string;
  };
  variation_values: VariationValue[];
  variation_album_images: string[];
}

interface VariationValue {
  attribute_value_id: number;
  value: string;
  price: string;
  discount: number;
}

const ListProducts = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const { id } = useParams();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await AxiosInstance.get('http://localhost:8000/api/admins/products');
      return response.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await AxiosInstance.delete(`http://localhost:8000/api/admins/products/${id}`);
    },
    onSuccess: () => {
      messageApi.success('Xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      messageApi.error('Xóa sản phẩm thất bại');
    },
  });
  // Hàm mở rộng để render danh sách các biến thể

  const columns: Array<any> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: Product, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      filters: productsData?.data?.map((product: Product) => ({
        text: product.name,
        value: product.name,
      })),
      onFilter: (value: string, record: Product) => record.name.includes(value),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Product, b: Product) => parseFloat(a.price) - parseFloat(b.price),
      render: (text: string) => <span>{parseFloat(text).toLocaleString()} VND</span>,
    },
    {
      title: 'Số Lượng',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <div className="max-w-xs truncate">
          {text.length > 30 ? ( 
            <Tooltip title={text}>  
              <span>
                {text.slice(0, 30)}...{' '}
                <Button
                  type="link"
                  onClick={() => messageApi.info(text)}
                  className="text-indigo-600 p-0"
                  style={{ fontSize: '0.875rem' }}  
                >
                  Xem chi tiết
                </Button>
              </span>
            </Tooltip>
          ) : (
            text
          )}
        </div>
      ),
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'input_day',
      key: 'input_day',
      render: (date: string) => <span>{format(new Date(date), 'dd/MM/yyyy')}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_name',
      key: 'category_name',
      filters: productsData?.data?.map((product: Product) => ({
        text: product.category_name,
        value: product.category_name,
      })),
      onFilter: (value: string, record: Product) => record.category_name === value,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Bình Luận',
      key: 'comments',
      render: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/dashboard/comments/list/${product.id}`)}
          >
            Xem Bình Luận
          </Button>

          
        </div>
      ),
    }
    ,
    {
      title: 'Action',
      key: 'action',
      render: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            type="default"
            icon={<EyeOutlined />}
            className='rounded-full'
            onClick={() => navigate(`/admin/dashboard/products/detail/${product.id}`)}
          />

          <Button
            type="default"
            icon={<EditOutlined />}
            className='rounded-full'
            onClick={() => navigate(`/admin/dashboard/products/update/${product.id}`)}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này không?"
            onConfirm={() => mutation.mutate(product.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger type="default"className='rounded-full'
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      {contextHolder}
      <div className="w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            icon={<PlusOutlined />}
            type="default"
            onClick={() => navigate('/admin/dashboard/products/add')}
          >
            Thêm mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={productsData?.data}
          bordered
          rowKey="id"
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
        />
      </div>
    </>
  );
};

export default ListProducts;
