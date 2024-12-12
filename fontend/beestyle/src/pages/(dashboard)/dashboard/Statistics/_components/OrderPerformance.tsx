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

type Props = {};

const List = (props: Props) => {
    const doughnutData = {
        labels: ['Đơn bị hủy', 'Đơn thành công'],
        datasets: [
            {

                data: [10, 90],
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
                text: 'Đơn hàng',
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

export default List;
