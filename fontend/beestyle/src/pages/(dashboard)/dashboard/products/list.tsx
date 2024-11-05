import React, { useState } from 'react';
import { Table, message, Button, Image, Tag, Modal, Popconfirm, Spin } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '@/configs/axios';

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
  const expandedRowRender = (record: Product) => {
    return (
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-lg">
        {record.variations.map((variant, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold text-indigo-600">Màu: {variant.attribute_value_image_variant.value}</h4>
            <Image
              className="rounded-lg mb-2"
              width={100}
              src={variant.attribute_value_image_variant.image_path}
              alt={variant.attribute_value_image_variant.value}
            />
            <h4 className="font-semibold text-gray-700">Số lượng tồn kho: {variant.stock}</h4>

            {variant.variation_values.map((value) => (
              <div key={value.attribute_value_id} className="ml-4 mt-2">
                <p>Size: {value.value}</p>
                <p>Giá: {parseFloat(value.price).toLocaleString()} VND</p>
                {value.discount > 0 && <Tag color="red" className="mt-2">Giảm giá: {value.discount}%</Tag>}
              </div>
            ))}

            <h4 className="font-semibold text-gray-700 mt-4">Album ảnh:</h4>
            <div className="flex space-x-2 mt-2">
              {variant.variation_album_images.map((image, imgIndex) => (
                <Image
                  key={imgIndex}
                  width={100}
                  className="rounded-lg"
                  src={image}
                  alt={`Album image ${imgIndex + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        <div className="truncate max-w-xs">
          {text.length > 20 ? (
            <>
              {text.slice(0, 20)}...
              <Button type="link" onClick={() => messageApi.info(text)}>Xem chi tiết</Button>
            </>
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
      title: 'Action',
      key: 'action',
      render: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<EyeOutlined />}
            className="text-white bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate(`/admin/products/detail/${product.id}`)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={() => navigate(`/admin/products/update/${product.id}`)}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này không?"
            onConfirm={() => mutation.mutate(product.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="primary" danger className="bg-red-500 text-white hover:bg-red-600" />
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate('/admin/products/add')}
          >
            Thêm mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={productsData?.data}
          bordered
          rowKey="id"
          expandable={{
            expandedRowRender: expandedRowRender, // Hiển thị danh sách biến thể dưới mỗi sản phẩm
          }}
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
