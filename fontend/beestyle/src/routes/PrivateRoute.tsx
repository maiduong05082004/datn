import { message } from 'antd';
import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const PrivateRouter = ({ children }: Props) => {
    const token = localStorage.getItem('tokenadmin');
    const userRole = localStorage.getItem('user');
    let check: boolean = true;

    if (!token || userRole !== 'admin') {
        check = false;
        message.error("Bạn không có quyền truy cập.");
    }

    return check ? children : <Navigate to={'/admin'} />;
};

export default PrivateRouter;
