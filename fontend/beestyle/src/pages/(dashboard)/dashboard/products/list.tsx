import React, { useState } from 'react';
import { Table, message, Button, Image, Tag, Modal, Popconfirm, Spin } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { keys } from 'lodash';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
  input_day: string;
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null); // State cho phần mô tả
  const navigate = useNavigate();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/products');
      return response.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://localhost:8000/api/admins/products/${id}`);
    },
    onSuccess: () => {
      messageApi.success('Xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      messageApi.error('Xóa sản phẩm thất bại');
    },
  });

  const showModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const showDescriptionModal = (description: string) => {
    setSelectedDescription(description);
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setSelectedDescription(null);
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
      onFilter: (value: string, record: Product) => record.name.indexOf(value) === 0,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Product, b: Product) => parseFloat(a.price) - parseFloat(b.price),
      sortDirections: ['ascend', 'descend'],
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
        <div style={{ maxWidth: '150px' }}>
          {text.length > 20 ? (
            <>
              {text.slice(0, 20)}...
              <Button type="link" onClick={() => showDescriptionModal(text)}>Xem chi tiết</Button>
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
      dataIndex: 'category_id',
      key: 'category_id',
      filters: productsData?.data
        ?.filter((product: Product) => product.group !== null)
        ?.map((product: Product) => ({
          text: product.group?.name,
          value: product.group?.name,
        })),
      onFilter: (value: string, record: Product) => record.group?.name === value,
      render: (category_id: number) => <span>{category_id}</span>,
    },
    {
      title: 'Biến thể',
      key: 'variations',
      render: (product: Product) => (
        <Button className="bg-black" type="primary" onClick={() => showModal(product)}>
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (product: Product) => (
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc muốn xóa sản phẩm này không?"
          onConfirm={() => mutation.mutate(product.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];


  const renderVariationDetails = () => {
    if (!selectedProduct) return null;
    return selectedProduct.variations.map((variant, index) => (
      <div key={index} className="mb-4 p-2 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-indigo-700">
          Tên biến thể: {selectedProduct?.group?.name}
        </h4>
        <h4 className="font-semibold text-indigo-700">
          Tên màu biến thể: {variant.attribute_value_image_variant.value}
        </h4>
        <Image
          width={50}
          height={50}
          src={variant.attribute_value_image_variant.image_path}
          alt={variant.attribute_value_image_variant.value}
        />
        {variant.variation_values.map((value: any) => (
          <div key={value.attribute_value_id} className="mt-2 p-2 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Size: {value.value}</h2>
              <div className="flex space-x-2 items-center">
                <span className="text-lg font-bold">{parseFloat(value.price).toLocaleString()} VND</span>
                {value.discount > 0 && <Tag color="red" className="ml-2">-{value.discount}%</Tag>}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <h2 className="font-semibold">Số Lượng:</h2>
              <h2 className="border border-[#ffa39e] rounded-sm bg-[#fff1f0] text-[#cf1322] mt-2 w-[44px] flex justify-center">
                {value.stock}
              </h2>
            </div>
          </div>
        ))}

        {/* Hiển thị album ảnh cho biến thể */}
        <div className="mt-4">
          <h2 className="font-bold">Album ảnh:</h2>
          <div className="flex space-x-2 mt-2">
            {variant.variation_album_images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Album image ${index + 1}`}
                width={200}
                height={200}
                className="rounded border"
              />
            ))}
          </div>
        </div>
      </div>
    ));
  };


  const renderDescriptionDetails = () => {
    if (!selectedDescription) return null;
    return (
      <div>
        <p>{selectedDescription}</p>
      </div>
    );
  };

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  return (
    <>
      {contextHolder}
      <div className="w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button type="primary" onClick={() => navigate('/add')}>
            Thêm mới
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={productsData?.data}
          rowKey="id"
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} danh mục`,
          }}
        />
      </div>

      <Modal
        title={selectedProduct ? `Chi tiết biến thể sản phẩm: ${selectedProduct?.name}` : 'Chi tiết mô tả'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedProduct ? renderVariationDetails() : renderDescriptionDetails()}
      </Modal>
    </>
  );
};

export default ListProducts;
