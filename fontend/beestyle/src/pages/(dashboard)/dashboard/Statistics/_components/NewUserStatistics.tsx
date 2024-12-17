import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2'; // Sử dụng Line từ react-chartjs-2
// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const NewUserStatistics = ({ year, month }: any) => {
    const { data: user_new } = useQuery({
        queryKey: ['user_new', year, month],
        queryFn: async () => {
            return instance.post(`api/admins/statistics/new-users`, {
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
        if (!user_new?.data) return timeLabels.map(label => ({
            label,
            total_users: 0
        }));

        return timeLabels.map(label => {
            const periodKey = month ? parseInt(label.toString()) : parseInt(label.toString());
            const periodData = user_new.data.data.find((item: any) => {
                if (month) {
                    return parseInt(item.period.split('-')[2]) === periodKey;
                } else {
                    return parseInt(item.month) === periodKey;
                }
            });

            return {
                label,
                total_users: periodData?.total_users || 0
            };
        });
    }, [user_new, timeLabels, month]);

    const chartData = {
        labels: fullData.map(item =>
            month ? `${item.label}` : `${item.label}`
        ),
        datasets: [
            {
                label: 'Lượt đăng ký mới',
                data: fullData.map(item => item.total_users || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0, // Làm mềm đường
                fill: true, // Hiển thị phần nền dưới đường
            },
        ],
    }

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
                text: [`Lượt đăng ký mới (${month ? "Tháng " + month + " - " + year : year === 0 ? '' : "Năm " + year})`,
                `Tổng: ${user_new?.data.summary.total_users || 0} lượt đăng kí`
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
