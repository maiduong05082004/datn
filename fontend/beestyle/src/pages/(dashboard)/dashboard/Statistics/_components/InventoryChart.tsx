import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import AxiosInstance from '@/configs/axios';

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const InventoryChart = () => {
    // Fetch dữ liệu từ API
    // const { data: Inventory, isLoading } = useQuery({
    //     queryKey: ['inventory'],
    //     queryFn: async () => {
    //         const response = await AxiosInstance('http://127.0.0.1:8000/api/admins/statistics/get_product_stock');
    //         return response.data;
    //     },
    // });

    // Kiểm tra trạng thái tải dữ liệu
    // if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    // const inStock = Inventory.filter((item :any) => item.stock > 0).length; 
    // const outOfStock = Inventory.filter((item : any) => item.stock === 0).length;  
    // const awaitingStock = Inventory.filter((item : any) => item.stock < 0).length;  
 
    // Dữ liệu cho biểu đồ
    const data = {
        labels: ['Còn hàng', 'Hết hàng', 'Đang chờ nhập kho'],
        datasets: [
            {

                data: [1, 2, 3], // Số lượng sản phẩm theo các trạng thái
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'], // Màu sắc cho các phần
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white', // Đổi màu chữ trong legend
                },
            },
            title: {
                color: 'white',
                display: true,
                text: 'Hàng tồn kho',
                font: {
                    family: 'Arial',
                    size: 18,
                    weight: '700',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${2}: ${1} sản phẩm`;
                    },
                },
            },
        },
    };

    return (
        <Doughnut data={data} options={options as any} />
    );
};

export default InventoryChart;
