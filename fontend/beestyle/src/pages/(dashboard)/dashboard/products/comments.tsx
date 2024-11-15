import { useQuery } from '@tanstack/react-query';
import React from 'react'
import axiosInstance from '@/configs/axios';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';

type Props = {}

const Comments = (props: Props) => {
  const { id } = useParams();
  const { data: CommentsData, isLoading } = useQuery({
    queryKey: ['comments', id],  // Đổi tên queryKey cho rõ ràng
    queryFn: async () => {
      const response = await axiosInstance.get(`http://localhost:8000/api/admins/comment/list/${id}`);
      return response.data;
    }
  });
  console.log(CommentsData);
  
  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  return (
    <div>Comments</div>
  )
}

export default Comments