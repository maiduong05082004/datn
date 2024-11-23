import axiosInstance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Spin } from 'antd';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Đăng ký các thành phần của ChartJS
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
  

  const barChartData = {
    labels: TopSelling.map(item => {
      const shortenedProductName = item.product.name.split('-')[0].trim(); 
      return `${shortenedProductName}\n(${item.product.input_day})`;
    }),
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

  return (
    <div className="p-4">
      <div className="flex justify-center gap-10">
        <div className="w-[45%] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
            Biểu đồ cột tổng bán
          </h3>
          <div style={{ width: '90%', margin: '0 auto' }}>
            <Bar data={barChartData} options={barOptions} />
          </div>
          <div className="flex justify-center mt-6">
            <Button type="primary" size="large" onClick={handleShowDetails}>
              Xemchi tiết
            </Button>
          </div>
        </div>
        {/* <div className="w-[45%] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
            Tỷ lệ sản phẩm bán chạy
          </h3>
          <div style={{ width: '70%', margin: '0 auto' }}>
            <Pie data={pieChartData} />
          </div>
        </div> */}
      </div>

      <Drawer
        title={<h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Chi tiết sản phẩm bán chạy</h2>}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={800} 
        bodyStyle={{
          padding: 0, 
        }}
        className="dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl"
      >
        <div className="bg-gray-50 dark:bg-gray-900 h-full px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2"
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <h4 className="font-semibold text-center text-lg text-gray-800 dark:text-gray-200">
                    {product.name}
                  </h4>
                </div>

                <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-400">
                  <p>
                    <strong>Giá:</strong>{" "}
                    <span className="text-blue-500 font-medium">
                      {parseFloat(product.price).toLocaleString()} VNĐ
                    </span>
                  </p>
                  <p>
                    <strong>Tồn kho:</strong>{" "}
                    <span className="text-green-500">{product.stock}</span>
                  </p>
                  <p>
                    <strong>Mô tả:</strong>{" "}
                    <span className="line-clamp-3">{product.description}</span>
                  </p>
                  <p>
                    <strong>Lượt xem:</strong>{" "}
                    <span className="text-yellow-500">{product.view}</span>
                  </p>
                  <p>
                    <strong>Ngày nhập:</strong>{" "}
                    <span className="italic">{product.input_day}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>

    </div>
  );
};

export default ListTopSelling;
