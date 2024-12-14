import instance from "@/configs/axios";
import { message } from "antd";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


const PrivateRouter = async ({ children }: any) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const navigate = useNavigate(); // Dùng để chuyển hướng
    const token = localStorage.getItem("token_admin");

    if (!token) {
        setIsAuthorized(false);
        message.error("Bạn không có quyền truy cập. Vui lòng đăng nhập.");
        return;
    }
    const { data } = await instance.get(`api/client/auth/profile`);
    console.log(data);

    if (data) {
        const userRole = data?.user.role;

        console.log(userRole);

        if (userRole == "admin") {
            setIsAuthorized(true);
            // navigate(`/admin/dashboard`)
        }
    }

    return isAuthorized ? children : <Navigate to="/admin" />;
}

export default PrivateRouter;
