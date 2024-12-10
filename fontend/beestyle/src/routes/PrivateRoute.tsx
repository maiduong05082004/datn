import { message } from 'antd';
import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const PrivateRouter = ({ children }: Props) => {
    const token = localStorage.getItem('tokenadmin');
    const userRole = localStorage.getItem('role');  // Lấy role từ localStorage

    console.log(token, userRole);  // Kiểm tra xem token và role có chính xác không

    let check: boolean = true;

    // Kiểm tra nếu không có token hoặc role không phải là "admin"
    if (!token || userRole !== 'admin') {
        check = false;
        message.error("Bạn không có quyền truy cập.");
    }

    return check ? children : <Navigate to={'/admin'} />;
};

export default PrivateRouter;
