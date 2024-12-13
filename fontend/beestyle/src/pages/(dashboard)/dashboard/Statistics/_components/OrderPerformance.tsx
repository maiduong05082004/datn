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
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderPerformance = ({year}: any) => {

    const { data: order_performance } = useQuery({
        queryKey: ['order_performance', year],
        queryFn: async () => {
            return instance.post(`api/admins/statistics/order_statistics`, {
                year: year
            })
        },
        enabled:!!year
    })

    const sum_yearly = () => {
        const delivered = order_performance?.data.sum_yearly[year].delivered
        const canceled = order_performance?.data.sum_yearly[year].canceled
        return [canceled, delivered]
    }

    const doughnutData = {
        labels: [`Đơn bị hủy ${sum_yearly()[0] || 0}`, `Đơn thành công ${sum_yearly()[1] || 0}`],
        datasets: [
            {
                data: sum_yearly(),
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
                text: `Đơn hàng (năm ${year || 0})`,
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

    return <Doughnut data={doughnutData} options={options as any} />;
};

export default OrderPerformance;
