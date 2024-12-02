import { Spin } from 'antd';
import React from 'react'
import axiosInstance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

type Props = {}

const CancelBill = (props: Props) => {
    const { id } = useParams();
    const { data: cancelBill, isLoading } = useQuery({
        queryKey: ['cancelbill', id],
        queryFn: async () => {
          const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`);
          return response.data;
        },
      });
      if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  return (
    <div>CancelBill</div>
  )
}

export default CancelBill