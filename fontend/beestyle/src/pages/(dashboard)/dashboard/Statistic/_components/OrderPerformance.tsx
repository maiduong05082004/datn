import { useQuery } from '@tanstack/react-query';
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import AxiosInstance from '@/configs/axios';
import { Spin, DatePicker, Button } from 'antd';
import { useState } from 'react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const List = () => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [filtered, setFiltered] = useState(false);

    const { data: OrderPerformance, isLoading } = useQuery({
        queryKey: ['delivered-products', startDate, endDate],
        queryFn: async () => {
            if (!startDate || !endDate) return [];  // No data if no dates are selected
            const response = await AxiosInstance.get('http://127.0.0.1:8000/api/admins/statistics/delivered_product', {
                params: {
                    'date[start]': startDate,
                    'date[end]': endDate,
                },
            });
            return response.data;
        },
        enabled: filtered, 
    });

    const handleDateChange = (dates: any) => {
        setStartDate(dates[0]?.format('YYYY-MM-DD') || null);
        setEndDate(dates[1]?.format('YYYY-MM-DD') || null);
        setFiltered(true);
    };

    const resetFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setFiltered(false);
    };

    // Check if data is loaded
    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    // Process data for the chart
    // const totalSold = OrderPerformance.reduce((sum: number, item: any) => sum + parseInt(item.total_sold), 0);
    // const totalRevenue = OrderPerformance.reduce((sum: number, item: any) => sum + parseInt(item.total_revenue), 0);

    const doughnutData = {
        labels: ['Đơn bị hủy', 'Đơn thành công'],
        datasets: [
            {
                data: [100 ], // Assuming percentage for "successful" orders
                // data: [100 - totalSold, totalSold], // Assuming percentage for "successful" orders
                backgroundColor: ['#ff6384', '#4bc0c0'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: {
                        family: 'Arial',
                        size: 14,
                        weight: '400',
                    },
                },
            },
            title: {
                display: true,
                text: 'Đơn hàng thành công',
                color: 'white',
                font: {
                    family: 'Arial',
                    size: 18,
                    weight: '700',
                },
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <DatePicker.RangePicker onChange={handleDateChange} />
                <Button onClick={resetFilter}>Reset Filter</Button>
            </div>
            <Doughnut data={doughnutData} options={options as any} />
        </div>
    );
};

export default List;
