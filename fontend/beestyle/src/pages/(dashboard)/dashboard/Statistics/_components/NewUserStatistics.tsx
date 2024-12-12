import React from 'react';
import { Line } from 'react-chartjs-2'; // Sử dụng Line từ react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

type Props = {}

const NewUserStatistics = (props: Props) => {
  // Dữ liệu cứng cho Line Chart (Doanh thu & Lợi nhuận theo tháng)
  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
      {
        label: `Tổng: ${new Intl.NumberFormat('vi-VN').format(4263)} khách hàng mới`,
        data: [500, 700, 800, 600, 400, 900, 1000, 1100, 950, 850, 750, 1220], // Dữ liệu doanh thu cứng
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0, // Làm mềm đường
        fill: true, // Hiển thị phần nền dưới đường
      },
    ],
  };

  // Tùy chọn cấu hình biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: 'white',
                font: {
                    size: 14,
                },
                boxWidth: 30,
                padding: 20,
                maxWidth: 200,
            },
        },
        title: {
            color: 'white',
            display: true,
            text: 'Khách hành mới',
            font: {
                family: 'Arial',
                size: 18,
                weight: '700',
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true, // Hiển thị tiêu đề trục x
                text: 'Ngày', // Văn bản tiêu đề
                color: 'white',
                font: {
                    family: 'Arial',
                    size: 14,
                    weight: '600',
                },
            },
            ticks: {
                color: 'white',
                font: {
                    family: 'Arial',
                    size: 12,
                    weight: '400',
                },
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.3)',
            },
        },
        y: {
            title: {
                display: true, // Hiển thị tiêu đề trục y
                text: 'Số lượng', // Văn bản tiêu đề
                color: 'white',
                font: {
                    family: 'Arial',
                    size: 14,
                    weight: '600',
                },
            },
            ticks: {
                color: 'white',
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.3)',
            },
        },
    },
};

  return (
    <Line className='w-[100%]' data={chartData} options={options as any} />
  );
};

export default NewUserStatistics;
