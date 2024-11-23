import React from 'react'
import axiosInstance from '@/configs/axios'
import { Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

type Props = {}

const ListCustomer = (props: Props) => {
  const { data: customerBehavior, isLoading } = useQuery({
    queryKey: ['customer-behavior'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://localhost:8000/api/admins/statistics/customer-behavior')
      return response.data
    },
  })

  if (isLoading)
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />

  const data = {
    labels: ['Lượt xem sản phẩm', 'Thêm vào giỏ hàng', 'Danh sách yêu thích'],
    datasets: [
      {
        label: 'Hành vi khách hàng',
        data: [
          customerBehavior.total_product_views,
          customerBehavior.total_cart_adds,
          customerBehavior.total_wishlist_adds,
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], 
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5, 
      },
    ],
  }

  const options = {
    responsive: true,
    indexAxis: 'y' as const, 
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Thống kê hành vi khách hàng',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw
            return `${value} lượt`
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Số lượt',
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Hành vi',
        },
      },
    },
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <Bar data={data} options={options} />
    </div>
  )
}

export default ListCustomer
