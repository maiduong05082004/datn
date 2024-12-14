import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Navigate } from "react-router-dom";


const PrivateRouter = ({ children }: any) => {
    
    let isAuthorized = false
    const token = localStorage.getItem("token_admin");
    console.log(token);
    const { data } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            return instance.get(`api/client/auth/profile`)
        },
    })
    if(data?.data.user.role === "admin") {
        isAuthorized = true
    }

    return isAuthorized ? children : <Navigate to="/admin" />;
}

export default PrivateRouter;
