import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { message, Spin } from "antd";
import instance from "@/configs/axios";

type Props = {
    children: React.ReactNode;
};

const PrivateRouter = ({ children }: Props) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            const token = localStorage.getItem("token_admin");
            if (!token) {
                setIsAuthorized(false);
                message.error("Bạn không có quyền truy cập. Vui lòng đăng nhập.");
                return;
            }

            try {
                const response = await instance.get("api/client/auth/profile");
                console.log("Profile Response:", response.data); // Debug

                const userRole = response?.data?.role;

                if (userRole === "admin") {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    message.error("Bạn không có quyền truy cập. Chỉ admin mới được phép.");
                }
            } catch (error: any) {
                console.error("Error:", error.response || error.message);
                setIsAuthorized(false);
                if (error.response?.status === 401) {
                    message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    message.error("Không thể xác thực người dùng. Vui lòng thử lại sau.");
                }
            }
        };

        checkAuthorization();
    }, []);

    // Hiển thị spinner khi đang kiểm tra quyền truy cập
    if (isAuthorized === null) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    // Nếu không được phân quyền, chuyển hướng về trang đăng nhập
    return isAuthorized ? children : <Navigate to="/admin" />;
};

export default PrivateRouter;
