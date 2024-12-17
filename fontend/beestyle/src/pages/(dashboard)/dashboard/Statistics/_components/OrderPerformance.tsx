import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderPerformance = ({ year, month }: any) => {
    const { data: orderPerformance } = useQuery({
        queryKey: ['order_performance', year, month],
        queryFn: async () => {
            return instance.post(`api/admins/statistics/order_statistics`, {
                year,
                ...(month && { month: parseInt(month) }),
            });
        },
        enabled: !!year,
    });

    const totalDelivered = useMemo(() => {
        return orderPerformance?.data?.data.reduce((sum: number, item: any) => sum + item.total_delivered, 0) || 0;
    }, [orderPerformance]);

    const totalCanceled = useMemo(() => {
        return orderPerformance?.data?.data.reduce((sum: number, item: any) => sum + item.total_canceled, 0) || 0;
    }, [orderPerformance]);

    const totalOrders = parseInt(totalDelivered) + parseInt(totalCanceled);

    const doughnutData = useMemo(() => {
        if (totalOrders) {
            const canceledPercentage = ((parseInt(totalCanceled) / totalOrders) * 100).toFixed(1);
            const deliveredPercentage = ((parseInt(totalDelivered) / totalOrders) * 100).toFixed(1);

            return {
                labels: [
                    `Đơn bị hủy: ${canceledPercentage}% (${parseInt(totalCanceled)})`,
                    `Đơn thành công: ${deliveredPercentage}% (${parseInt(totalDelivered)})`,
                ],
                datasets: [
                    {
                        data: [parseInt(totalCanceled), parseInt(totalDelivered)],
                        backgroundColor: ['#ff6384', '#4bc0c0'],
                    },
                ],
            };
        } else {
            return {
                labels: ['Không có dữ liệu'],
                datasets: [
                    {
                        data: [1],
                        backgroundColor: ['#cccccc'],
                    },
                ],
            };
        }
    }, [totalCanceled, totalDelivered]);

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
                text: `Đơn hàng (${month ? "Tháng " + month + " - " + year : year === 0 ? '' : "Năm " + year})`,
                color: 'white',
                font: {
                    family: 'Arial',
                    size: 18,
                    weight: '700',
                },
            },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    return <Doughnut data={doughnutData} options={options as any} />;
};

export default OrderPerformance;
