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

const ListNewPerson = (props: Props) => {
  // Fetch dữ liệu từ API
  const { data: StatisticsPerson, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://localhost:8000/api/admins/statistics/new-users')
      return response.data
    },
  })

  if (isLoading)
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />

  const dates = StatisticsPerson.map((item: { date: string }) => item.date)
  const totalUsers = StatisticsPerson.map((item: { total_users: number }) => item.total_users)

  const data = {
    labels: dates, 
    datasets: [
      {
        label: 'Số người dùng mới',
        data: totalUsers, 
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Thống kê số người dùng mới theo ngày',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Số người dùng',
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Thống kê người dùng mới
      </h2>
      <Bar data={data} options={options} />
    </div>
  )
}

export default ListNewPerson
