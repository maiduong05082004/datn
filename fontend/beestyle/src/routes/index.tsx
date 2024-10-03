import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import ProductManagementPage from "@/pages/(dashboard)/product/page";
import ErrorPage from "@/pages/(website)/404/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import Signin from "@/pages/signin/signin";
import Signup from "@/pages/signup/signup";
import { Route, Routes } from "react-router-dom";
import GoogleCallback from "@/pages/GoogleCallback/GoogleCallback";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="signin" element={<Signin />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="auth/google/callback" element={<GoogleCallback />} />
                </Route>
                <Route path="admin" element={<LayoutAdmin/>}>
                    <Route index element={<DashboardPage/>}/>
                    <Route path="products" element={<ProductManagementPage/>}/>
                </Route>
                <Route path="**" element={<ErrorPage />} />
            </Routes>
        </>
    );
};

export default Router;
