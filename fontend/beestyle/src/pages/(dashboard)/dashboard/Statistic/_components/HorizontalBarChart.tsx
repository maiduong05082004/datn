import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AxiosInstance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {}

const HorizontalBarChart = (props: Props) => {
//   const { data: TopSelling, isLoading } = useQuery({
//     queryKey: ['topselling'],
//     queryFn: async () => {
//         const response = await AxiosInstance('http://127.0.0.1:8000/api/admins/statistics/top-selling-products');
//         return response.data;
//     },
// });
  const data = {
    labels: ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D', 'Sản phẩm E','Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C', 'Sản phẩm D', 'Sản phẩm E', 'Sản phẩm D', 'Sản phẩm E'],
    datasets: [
      {
        label: 'Số lượng bán ra',
        data: [120, 150, 180, 100, 90], // Dữ liệu cột ngang
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu cột
        borderColor: 'rgba(75, 192, 192, 1)', // Màu viền
        borderWidth: 1, // Độ dày viền
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Đổi trục để biểu đồ hiển thị cột ngang
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const, // Vị trí của legend
        labels: {
          color: 'white', // Màu chữ của legend
        },
      },
      title: {
        display: true,
        text: 'Top 12 sản phẩm bán chạy',
        color: 'white', // Màu chữ của title
        font: {
          family: 'Arial',
          size: 18,
          weight: '700',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Màu chữ trục x
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Màu lưới trục x
        },
      },
      y: {
        ticks: {
          color: 'white', // Màu chữ trục y
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Màu lưới trục y
        },
      },
    },
  };
  // if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={data} options={options as any} />
    </div>
  );
};

export default HorizontalBarChart;
