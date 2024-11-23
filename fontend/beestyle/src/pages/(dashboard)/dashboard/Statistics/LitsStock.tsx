import React from 'react'
import axiosInstance from '@/configs/axios'
import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'


type Props = {}

const StatisticStock = (props: Props) => {
    const { data: StatisticsStock, isLoading } = useQuery({
        queryKey: ['statistics'],
        queryFn: async () => {
          const response = await axiosInstance.get('http://localhost:8000/api/admins/statistics/revenue-and-profit')
          return response.data
        },
      })
      if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  return (
    <div>StatisticStock</div>
  )
}

export default StatisticStock