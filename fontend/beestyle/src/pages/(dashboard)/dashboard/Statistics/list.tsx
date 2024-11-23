import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import axiosInstance from '@/configs/axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {}

interface DataItem {
  product_name: string
  size: string
  color: string
  period: string
  total_revenue: number
  total_profit: number
}

const ListStatistics = (props: Props) => {
  const { data: Statistics, isLoading, error } = useQuery<DataItem[]>({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://localhost:8000/api/admins/statistics/revenue-and-profit')
      return response.data
    },
  })

  if (isLoading) return <div className="text-center text-lg text-gray-700">Đang tải dữ liệu...</div>
  if (error) return <div className="text-center text-lg text-red-600">Lỗi khi lấy dữ liệu</div>
  if (!Statistics || Statistics.length === 0) return <div className="text-center text-lg text-gray-700">Không có dữ liệu thống kê</div>

  const labels = Statistics.map(item => {
    const shortenedProductName = item.product_name.split('-')[0].trim(); 
    return `${shortenedProductName}\n(${item.period})`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Tổng doanh thu',
        data: Statistics.map(item => item.total_revenue),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Tổng lợi nhuận',
        data: Statistics.map(item => item.total_profit),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  }

  const doughnutData = {
    labels: ['Tổng doanh thu', 'Tổng lợi nhuận'],
    datasets: [
      {
        data: [
          Statistics.reduce((acc, item) => acc + item.total_revenue, 0), 
          Statistics.reduce((acc, item) => acc + item.total_profit, 0),  
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          text: 'Sản phẩm (Thời gian)',
        },
      },
      y: {
        title: {
          text: 'Số tiền (VNĐ)',
        },
      },
    },
  }

  return (
    <div className="flex justify-center gap-10 pt-10">
      <div className=" w-[45%] h-auto bg-gray-100 rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">Thống kê Doanh thu và Lợi nhuận</h2>
        <Bar data={chartData} options={options} />
      </div>
      <div className="w-[45%] bg-gray-100 rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">
          Tổng Doanh Thu Và Lợi Nhuận
        </h2>
        <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
          <Doughnut data={doughnutData} options={options} />
        </div>
      </div>

    </div>
  )
}

export default ListStatistics
