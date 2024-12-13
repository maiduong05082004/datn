import React from 'react';
import { Line } from 'react-chartjs-2'; // Sử dụng Line từ react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const NewUserStatistics = ({year}: any) => {
    const { data: user_new } = useQuery({
        queryKey: ['user_new', year],
        queryFn: async () => {
            return instance.post(`api/admins/statistics/new-users`, {
                summary: true,
                group_by: "month",
                year: year
            })
        },
        enabled:!!year
    })

    const fullYearData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1; // Tháng (1-12)
        const monthData = user_new?.data.data.find(
            (item: any) => parseInt(item.month) === month
        );
        return {
            month,
            total_users: monthData?.total_users || 0,
        };
    });

    // Dữ liệu cứng cho Line Chart (Doanh thu & Lợi nhuận theo tháng)
    const chartData = {
        labels: fullYearData.map(item => `${item.month}`),
        datasets: [
            {
                label: 'Lượt đăng ký mới',
                data: fullYearData.map(item => item.total_users || 0),
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
                text: `Lượt đăng ký mới (năm ${year || 0})`,
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
                    text: '(Tháng)', // Văn bản tiêu đề
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
                    text: '(Số lượng)', // Văn bản tiêu đề
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
