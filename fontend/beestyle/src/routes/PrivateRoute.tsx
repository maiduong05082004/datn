import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { Navigate } from "react-router-dom";


const PrivateRouter = ({ children }: any) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            return instance.get(`api/client/auth/profile`);
        },
    });

    if (isLoading) {
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    }

    if (error) {
        return <Navigate to="/erorr" />;
    }

    const isAuthorized = data?.data?.user?.role === "admin";

    return isAuthorized ? children : <Navigate to="/admin" />;
};

export default PrivateRouter;
