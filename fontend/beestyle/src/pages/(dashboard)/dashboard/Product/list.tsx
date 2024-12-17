import React, { useState } from 'react';
import { Table, Button,Modal, Popconfirm, Spin, Tooltip } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import instance from '@/configs/axios';
import SearchComponent from '@/components/ui/search';

interface Product {
  id: number;
  name: string;
  slug:string;
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('');
  // const { id } = useParams();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await instance.get(`api/admins/products`);
      return response.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`api/admins/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Xóa Sản Phẩm Thành Công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast.error('Xóa Sản Phẩm Thất Bại!');

    },
  });

  const columns: Array<any> = [
    {
      title: 'Xem Trước',
      key: 'action',
      align: 'center',
      width: "50px",
      render: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<PlusOutlined />}

            onClick={() => navigate(`/admin/dashboard/products/show/${product.id}`)}
          />
        </div>
      ),
    },
    // {
    //   title: 'STT',
    //   dataIndex: 'index',
    //   key: 'index',
    //   align: 'center',
    //   width: "50px",
    //   render: (_: any, __: Product, index: number) => <span>{index + 1}</span>,
    // },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: "250px",
      filters: productsData?.data?.map((product: Product) => ({
        text: product.name,
        value: product.name,
      })),
      onFilter: (value: string, record: Product) => record.name.includes(value),
    },
    {
      title: 'Mã Sản Phẩm',
      dataIndex: 'slug',
      key: 'slug',
      align: 'center',
    },
    {
      title: 'Số Lượng',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center',
    },
    {
      title: 'Giá Nhập',
      dataIndex: 'product_cost',
      key: 'product_cost',
      align: 'center',
      render: (product_cost: { cost_price: string }) => (
        <span>{product_cost?.cost_price ? parseFloat(product_cost.cost_price).toLocaleString() : 'Không có'} VND</span>
      ),
    }
    ,
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      align: 'center',
      key: 'price',
      sorter: (a: Product, b: Product) => parseFloat(a.price) - parseFloat(b.price),
      render: (text: string) => <span>{parseFloat(text).toLocaleString()} VND</span>,
    },
    ,
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: "100px",
      key: 'description',
      render: (text: string) => (
        <div className="max-w-xs truncate">
          {text.length > 20 ? (
            <Tooltip title={text}>
              <span>
                {text.slice(0, 20)}...{' '}
                <Button
                  type="default"
                  onClick={() => {
                    setCurrentDescription(text);
                    setIsModalVisible(true);
                  }}
                  className="text-indigo-600"
                  style={{ fontSize: '0.875rem' }}
                  icon={<EyeOutlined />}
                >
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
      title: 'Danh mục',
      dataIndex: 'category_name',
      align: 'center',
      key: 'category_name',
      width: "100px",
      filters: productsData?.data?.map((product: Product) => ({
        text: product.category_name,
        value: product.category_name,
      })),
      onFilter: (value: string, record: Product) => record.category_name === value,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Bình Luận',
      align: 'center',
      key: 'comments',
      width: "50px",
      render: (product: Product) => (
        <div className="m-auto">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/dashboard/comments/list/${product.id}`)}
          >
          </Button>


        </div>
      ),
    }
    ,
    {
      title: 'Hành Động',
      key: 'action',
      align: 'center',
      width: "50px",
      render: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            type="default"
            icon={<EyeOutlined />}

            onClick={() => navigate(`/admin/dashboard/products/detail/${product.id}`)}
          />

          <Button
            type="default"
            icon={<EditOutlined />}

            onClick={() => navigate(`/admin/dashboard/products/update/${product.id}`)}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này không?"
            onConfirm={() => mutation.mutate(product.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger type="default"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      return;
    }
    setSearchQuery(query);
  };

  const handleSort = (sortKey: string) => {
    setSortKey(sortKey);
  };

  const filteredProducts = productsData?.data?.filter((product: Product) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.price.toString().includes(searchLower) ||
      product.category_name.toLowerCase().includes(searchLower)||
      product.slug.toLowerCase().includes(searchLower)
    );
  });

  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    switch (sortKey) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'category_name':
        return a.category_name.localeCompare(b.category_name);
      case 'slug':
        return a.slug.localeCompare(b.slug);
      default:
        return 0;
    }
  });

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <ToastContainer />
      <div className="w-full mx-auto p-5">
        <div className="flex justify-between items-center mb-6">
          <Button
            icon={<PlusOutlined />}
            type="default"
            onClick={() => navigate('/admin/dashboard/products/add')}
          >
            Thêm mới
          </Button>
        </div>

        <SearchComponent
          items={filteredProducts || []}
          onSearch={handleSearch}
          onSortChange={handleSort}
          sortOptions={['name', 'price', 'category_name']}
          sortOptionsName={['Tên sản phẩm', 'Giá sản phẩm', 'Danh mục']}
        />

        <Table
          columns={columns}
          dataSource={sortedProducts}
          bordered
          rowKey="id"
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
        />
        <Modal
          title="Chi tiết mô tả"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          <p>{currentDescription}</p>
        </Modal>
      </div>
    </>
  );
};

export default ListProducts;
