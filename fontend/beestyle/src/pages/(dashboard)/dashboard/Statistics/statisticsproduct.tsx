import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { Bar } from 'react-chartjs-2';
import { Spin } from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsProducts = () => {
    const { data: ProductDelivered, isLoading: deliveredLoading } = useQuery({
        queryKey: ['delivered'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://localhost:8000/api/admins/statistics/delivered_product');
            return response.data;
        },
    });

    const { data: ProductCanceled, isLoading: canceledLoading } = useQuery({
        queryKey: ['canceled'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://localhost:8000/api/admins/statistics/canceled_product');
            return response.data;
        },
    });

    if (deliveredLoading || canceledLoading) {
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    }

    const productNames = Array.from(
        new Set([
            ...(ProductDelivered || []).map((product: any) => product.product_name),
            ...(ProductCanceled || []).map((product: any) => product.product_name),
        ])
    );

    const deliveredData = productNames.map((name) => {
        const product = (ProductDelivered || []).find((p: any) => p.product_name === name);
        return product ? product.total_revenue : 0;
    });

    const canceledData = productNames.map((name) => {
        const product = (ProductCanceled || []).find((p: any) => p.product_name === name);
        return product ? product.total_revenue : 0;
    });

    const chartData = {
        labels: productNames,
        datasets: [
            {
                label: 'Doanh thu từ sản phẩm đã giao',
                data: deliveredData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Doanh thu từ sản phẩm đã hủy',
                data: canceledData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Thống kê doanh thu theo sản phẩm',
            },
        },
    };

    return (
        <div className="p-5">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default StatisticsProducts;
