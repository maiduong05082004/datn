import { message } from 'antd'
import React from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
    children: React.ReactNode;
    userRole: string | null;
}

const PrivateRouter = ({ children, userRole }: Props) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(token, user);

    let check: boolean = true;
    if (!token || user?.role !== 'admin') {
        check = false;
        message.error("Bạn không có quyền truy cập");
    }
    console.log(check);

    return check ? children : <Navigate to={'/admin'} />;
}
export default PrivateRouter;