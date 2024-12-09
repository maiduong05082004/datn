import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HorizontalBarChart = () => {

  const { data: top_12_products_sell_well } = useQuery({
    queryKey: ['top_12_products_sell_well'],
    queryFn: async () => {
      return instance.post(`admins/statistics/top-selling-products`, {} ,{
      })
    },
  })
  

  const data = {
    labels: top_12_products_sell_well?.data.map((item: any) => item.product.slug),
    datasets: [
      {
        label: 'Số lượng bán ra',
        data: top_12_products_sell_well?.data.map((item: any) => item.total_sold),
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
        text: 'Top 12 sản phẩm bán chạy (1 tháng gần nhất)',
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
      <Bar data={data} options={options as any} />
  );
};

export default HorizontalBarChart;
