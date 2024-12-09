import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const PrivateRouter = ({ children }: Props) => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    const token = localStorage.getItem('token');
    
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {

            console.log(token);
            
            return await axios.get(`http://127.0.0.1:8000/api/client/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
            })
        }
    })
    console.log(data);
    


    if (isLoading) {
        return <div>Đang tải...</div>;
      }
    
      // Hiển thị thông báo lỗi và chuyển hướng nếu có lỗi
      if (isError || !data) {
        return <Navigate to="/login" />;
      }
      
    // Hiển thị loading trong khi chờ dữ liệu
    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // Kiểm tra role
    // if (userRole !== 'admin') {
    //     message.error('Bạn không có quyền truy cập');
    //     return <Navigate to="/admin" />;
    // }

    // Nếu là admin, render children
    return <>{children}</>;
};

export default PrivateRouter;
