import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Sử dụng Line từ react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import instance from '@/configs/axios';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const RevenueProfitStatistics = ({year}: any) => {

   

    const { data: revenue_profit_statistics } = useQuery({
        queryKey: ['revenue-profit-statistics', year],
        queryFn: async () => {
            return instance.post(`api/admins/statistics/revenue-and-profit`, {
                summary: true,
                group_by: "month",
                year: parseInt(year)
            })
        },
        enabled: !!year
    })

    const fullYearData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1; // Tháng (1-12)
        const monthData = revenue_profit_statistics?.data.find(
            (item: any) => parseInt(item.period.split('-')[1]) === month
        );
        return {
            month,
            total_revenue: monthData?.total_revenue || 0,
            total_profit: monthData?.total_profit || 0,
        };
    });
    const totalRevenue = revenue_profit_statistics?.data.reduce(
        (sum: any, item: any) => sum + item.total_revenue,
        0
    );
    const totalProfite = revenue_profit_statistics?.data.reduce(
        (sum: any, item: any) => sum + item.total_profit,
        0
    );
    // Dữ liệu cứng cho Line Chart (Doanh thu & Lợi nhuận theo tháng)
    const chartData = {
        labels: fullYearData.map(item => `${item.month}`),
        datasets: [
            {
                label: `Doanh Thu`,
                data: fullYearData.map(item => item.total_revenue || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4, // Làm mềm đường
                fill: true, // Hiển thị phần nền dưới đường
            },
            {
                label: `Lợi Nhuận`,
                data: fullYearData.map(item => item.total_profit || 0),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true,
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
                text: [
                    `Doanh thu và Lợi nhuận (năm ${year === 0 ? '' : year})`,
                    `Doanh Thu: ${new Intl.NumberFormat('vi-VN').format(totalRevenue || 0)} VND | Lợi Nhuận: ${new Intl.NumberFormat('vi-VN').format(totalProfite || 0)} VND`,
                ],
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
                    text: 'Số tiền (VNĐ)', // Văn bản tiêu đề
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
        <>
            
            <Line className='w-[100%]' data={chartData} options={options as any} />
        </>
    );
};

export default RevenueProfitStatistics;
