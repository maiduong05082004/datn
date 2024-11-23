import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spin, Button, Drawer } from 'antd';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import axiosInstance from '@/configs/axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type Props = {};

interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  stock: number;
  description: string;
  view: number;
  input_day: string;
}

interface TopSellingItem {
  product_id: number;
  total_sold: number;
  product: Product;
}

const ListTopSelling = (props: Props) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const { data: TopSelling, isLoading, error } = useQuery<TopSellingItem[]>({
    queryKey: ['topselling'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        'http://localhost:8000/api/admins/statistics/top-selling-products'
      );
      return response.data;
    },
  });

  if (isLoading)
    return (
      <Spin
        tip="Đang tải dữ liệu..."
        className="flex justify-center items-center h-screen"
      />
    );
  if (error) return <div>Lỗi khi lấy dữ liệu</div>;
  if (!TopSelling || TopSelling.length === 0)
    return <div>Không có sản phẩm bán chạy nào</div>;

  const handleShowDetails = () => {
    const products = TopSelling.map((item) => item.product);
    setSelectedProducts(products);
    setDrawerVisible(true);
  };

  // Dữ liệu biểu đồ tròn
  const pieChartData = {
    labels: TopSelling.map((item) => item.product.name),
    datasets: [
      {
        data: TopSelling.map((item) => item.total_sold),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Dữ liệu biểu đồ cột
  const barChartData = {
    labels: TopSelling.map((item) => item.product.name),
    datasets: [
      {
        label: 'Tổng bán',
        data: TopSelling.map((item) => item.total_sold),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sản phẩm',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Số lượng bán',
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Danh sách sản phẩm bán chạy</h2>

      {/* Biểu đồ */}
      <div className="flex justify-center gap-10">
        <div className="w-[49%] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
            Biểu đồ cột tổng bán
          </h3>
          <div style={{ width: '90%', margin: '0 auto' }}>
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
        <div className="w-[49%] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
            Tỷ lệ sản phẩm bán chạy
          </h3>
          <div style={{ width: '90%', margin: '0 auto' }}>
            <Pie data={pieChartData} />
          </div>
        </div>
      </div>

      {/* Nút hiển thị danh sách chi tiết */}
      <div className="flex justify-center mt-6">
        <Button type="primary" size="large" onClick={handleShowDetails}>
          Xem danh sách chi tiết
        </Button>
      </div>

      {/* Drawer hiển thị chi tiết */}
      <Drawer
        title="Chi tiết sản phẩm bán chạy"
        placement="bottom"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        height={500} 
        className="dark:bg-gray-900"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700"
            >
              <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 text-center mb-2">
                {product.name}
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                <p>
                  <strong>Giá:</strong> {parseFloat(product.price).toLocaleString()} VNĐ
                </p>
                <p>
                  <strong>Tồn kho:</strong> {product.stock}
                </p>
                <p>
                  <strong>Mô tả:</strong> {product.description}
                </p>
                <p>
                  <strong>Lượt xem:</strong> {product.view}
                </p>
                <p>
                  <strong>Ngày nhập:</strong> {product.input_day}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default ListTopSelling;
