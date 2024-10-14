import React, { useState } from 'react';
import { Table, message, Button, Image, Tag, Modal } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';

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

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/products');
      return response.data;
    },
    onError: () => {
      message.error('Lỗi khi lấy danh sách sản phẩm');
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://localhost:8000/api/admins/products/${id}`);
    },
    onSuccess: () => {
      messageApi.success('Xóa thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
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

  // Bộ lọc giá sản phẩm
  const priceFilters = [
    { text: 'Dưới 1 triệu', value: 'under_1m' },
    { text: '1 triệu - 5 triệu', value: '1_to_5m' },
    { text: 'Trên 5 triệu', value: 'over_5m' },
  ];

  const onPriceFilter = (value: string, record: Product) => {
    const price = parseFloat(record.price);
    if (value === 'under_1m') {
      return price < 1000000;
    }
    if (value === '1_to_5m') {
      return price >= 1000000 && price <= 5000000;
    }
    return price > 5000000;
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      filters: priceFilters,
      onFilter: onPriceFilter,
      render: (text: string) => <span>{parseFloat(text).toLocaleString()} VND</span>,
    },
    {
      title: 'Tồn kho (Tổng)',
      dataIndex: 'stock',
      key: 'stock',
      render: (_: any, record: Product) => (
        <div>
          {record.variations.reduce((total, variant) => total + variant.stock, 0)} {/* Tính tổng số lượng tồn kho từ các biến thể */}
        </div>
      ),
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
      dataIndex: ['group', 'name'],
      key: 'group',
      filters: productsData?.data
        .filter((product: Product) => product.group !== null)
        .map((product: Product) => ({
          text: product.group?.name,
          value: product.group?.name,
        })),
      onFilter: (value: string, record: Product) => record.group?.name === value,
      render: (text: string) => <Tag color="blue">{text || 'Không có danh mục'}</Tag>,
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
        <Button
          danger
          onClick={() => mutation.mutate(product.id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const renderVariationDetails = () => {
    if (!selectedProduct) return null;
    return selectedProduct.variations.map((variant, index) => (
      <div key={index} className="mb-4 p-2 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-indigo-700">Màu sắc: {variant.attribute_value_image_variant.value}</h4>
        <Image
          width={50}
          height={50}
          src={variant.attribute_value_image_variant.image_path}
          alt={variant.attribute_value_image_variant.value}
        />
        {variant.variation_values.map((value) => (
          <div key={value.attribute_value_id} className="flex justify-between mt-2">
            <h2>Size:</h2>
            <span>{value.value}</span>
            <span>
              {parseFloat(value.price).toLocaleString()} VND{' '}
              {value.discount > 0 && <Tag color="red">-{value.discount}%</Tag>}
            </span>
          </div>
        ))}
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

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="w-full max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold text-center pb-10 text-indigo-600">Quản Lý Sản Phẩm</h2>
        <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={productsData?.data}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
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
