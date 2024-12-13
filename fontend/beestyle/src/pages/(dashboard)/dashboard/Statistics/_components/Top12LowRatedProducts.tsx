import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {}

const Top12LowRatedProducts = (props: Props) => {

  const { data: top_12_products_low_rate } = useQuery({
    queryKey: ['top_12_products_low_rate'],
    queryFn: async () => {
      return instance.get(`api/admins/statistics/get_top_rated`)
    },
  })

  console.log(top_12_products_low_rate);
  

  const data = {
    labels: top_12_products_low_rate?.data.low.map((item: any) => item?.product?.slug),
    datasets: [
      {
        label: 'Trung bình sao',
        data: top_12_products_low_rate?.data.low.map((item: any) => item.average_stars),
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
        text: 'Top 12 sản phẩm có đánh giá thấp (tháng hiện tại)',
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

  return (
    <Bar data={data} options={options as any} />
  );
};

export default Top12LowRatedProducts;
