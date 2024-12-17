import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2'; // Sử dụng Line từ react-chartjs-2

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const RevenueProfitStatistics = ({ year, month }: any) => {

    const { data: revenue_profit_statistics } = useQuery({
        queryKey: ['revenue-profit-statistics', year, month],
        queryFn: async () => {
            return instance.post(`api/admins/statistics/revenue-and-profit`, {
                summary: true,
                group_by: month ? "day" : "month",
                year: parseInt(year.toString()),
                ...(month && { month: parseInt(month.toString()) }),
            })
        },
        enabled: !!year
    })
    const timeLabels = useMemo(() => {
        if (month) {
            const date = new Date(year, month, 0);
            const totalDays = date.getDate();
            return Array.from({ length: totalDays }, (_, i) => i + 1);
        } else {
            return Array.from({ length: 12 }, (_, i) => i + 1);
        }
    }, [year, month]);

    const fullData = useMemo(() => {
        if (!revenue_profit_statistics?.data) return timeLabels.map(label => ({
            label,
            total_revenue: 0,
            total_profit: 0,
        }));

        return timeLabels.map(label => {
            const periodKey = month ? parseInt(label.toString()) : parseInt(label.toString());
            const periodData = revenue_profit_statistics.data.find((item: any) => {
                if (month) {
                    return parseInt(item.period.split('-')[2]) === periodKey;
                } else {
                    return parseInt(item.period.split('-')[1]) === periodKey;
                }
            });

            return {
                label,
                total_revenue: periodData?.total_revenue || 0,
                total_profit: periodData?.total_profit || 0,
            };
        });
    }, [revenue_profit_statistics, timeLabels, month]);

    const totalRevenue = useMemo(() => {
        return revenue_profit_statistics?.data?.reduce((sum: number, item: any) => sum + item.total_revenue, 0) || 0;
    }, [revenue_profit_statistics]);

    const totalProfit = useMemo(() => {
        return revenue_profit_statistics?.data?.reduce((sum: number, item: any) => sum + item.total_profit, 0) || 0;
    }, [revenue_profit_statistics]);

    const chartData = {
        labels: fullData.map(item =>
            month ? `${item.label}` : `${item.label}`
        ),
        datasets: [
            {
                label: `Doanh Thu`,
                data: fullData.map(item => item.total_revenue || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4, // Làm mềm đường
                fill: true, // Hiển thị phần nền dưới đường
            },
            {
                label: `Lợi Nhuận`,
                data: fullData.map(item => item.total_profit || 0),
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
                    `Doanh thu và Lợi nhuận (${month ? "Tháng " + month + " - " + year : year === 0 ? '' : "Năm " + year})`,
                    `Doanh Thu: ${new Intl.NumberFormat('vi-VN').format(totalRevenue || 0)
                    } VND | Lợi Nhuận: ${new Intl.NumberFormat('vi-VN').format(totalProfit || 0)} VND`,
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
                    text: `${month ? "(Ngày)" : "(Tháng)"}`, // Văn bản tiêu đề
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
        <Line className='w-[100%]' data={chartData} options={options as any} />
    );
};

export default RevenueProfitStatistics;