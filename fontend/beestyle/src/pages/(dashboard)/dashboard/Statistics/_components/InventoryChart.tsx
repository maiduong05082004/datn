import React from 'react';
import { Line } from 'react-chartjs-2'; // Sử dụng Line từ react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const NewUserStatistics = ({ year, month }: any) => {
    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['user_statistics', year, month],
        queryFn: async () => {
            return instance.post(`api/admins/statistics/new-users`, {
                summary: true,
                group_by: month ? "day" : "month", // Nếu có tháng, group_by theo ngày
                year,
                month,
            });
        },
        enabled: !!year, // Chỉ gọi API nếu có `year`
    });

    // Xử lý dữ liệu theo năm (hàng tháng) hoặc tháng (hàng ngày)
    const chartData = React.useMemo(() => {
        if (!userData?.data) return null;

        if (month) {
            // Trường hợp hiển thị dữ liệu theo ngày trong tháng
            const daysInMonth = new Date(year || 0, month, 0).getDate(); // Số ngày trong tháng
            const fullMonthData = Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayData = userData.data.find((item: any) => parseInt(item.day) === day);
                return {
                    day,
                    total_users: dayData?.total_users || 0,
                };
            });

            return {
                labels: fullMonthData.map((item) => `Ngày ${item.day}`),
                datasets: [
                    {
                        label: 'Lượt đăng ký mới',
                        data: fullMonthData.map((item) => item.total_users),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    },
                ],
            };
        } else {
            // Trường hợp hiển thị dữ liệu theo tháng trong năm
            const fullYearData = Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const monthData = userData.data.find((item: any) => parseInt(item.month) === month);
                return {
                    month,
                    total_users: monthData?.total_users || 0,
                };
            });

            return {
                labels: fullYearData.map((item) => `Tháng ${item.month}`),
                datasets: [
                    {
                        label: 'Lượt đăng ký mới',
                        data: fullYearData.map((item) => item.total_users),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    },
                ],
            };
        }
    }, [userData, month, year]);

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
                },
            },
            title: {
                color: 'white',
                display: true,
                text: month
                    ? `Lượt đăng ký mới (Tháng ${month}/${year})`
                    : `Lượt đăng ký mới (Năm ${year})`,
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
                    display: true,
                    text: month ? '(Ngày)' : '(Tháng)',
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
                    display: true,
                    text: '(Số lượng)',
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

    // Hiển thị trạng thái tải hoặc lỗi
    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (isError || !chartData) return <p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>;

    return <Line className="w-full h-full" data={chartData} options={options as any} />;
};

export default NewUserStatistics;
