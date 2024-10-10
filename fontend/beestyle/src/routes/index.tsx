import AddBanners from "@/pages/(dashboard)/dashboard/banners/add";
import ListBanners from "@/pages/(dashboard)/dashboard/banners/list";
import UpdateBanners from "@/pages/(dashboard)/dashboard/banners/update";
import ListBills from "@/pages/(dashboard)/dashboard/bills/list";
import AddCategories from "@/pages/(dashboard)/dashboard/categories/add";
import ListCategories from "@/pages/(dashboard)/dashboard/categories/list";
import UpdateCategories from "@/pages/(dashboard)/dashboard/categories/update";
import ListComments from "@/pages/(dashboard)/dashboard/comments/list";
import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import Addproduct from "@/pages/(dashboard)/dashboard/products/add";
import ListProducts from "@/pages/(dashboard)/dashboard/products/list";
import UpdateProduct from "@/pages/(dashboard)/dashboard/products/update";
import VariantProduct from "@/pages/(dashboard)/dashboard/products/variant";
import AddUser from "@/pages/(dashboard)/dashboard/user/add";
import ListUser from "@/pages/(dashboard)/dashboard/user/list";
import UpdateUser from "@/pages/(dashboard)/dashboard/user/update";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import ErrorPage from "@/pages/(website)/404/page";
import PageSignin from "@/pages/(website)/auth/signin/page";
import PageSignup from "@/pages/(website)/auth/signup/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import ListPage from "@/pages/(website)/list/page";
import { Route, Routes } from "react-router-dom";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite />}>
                    <Route index element={<HomePage />} />
                    <Route path="category/:id/products" element={<ListPage />} />
                    <Route path="signin" element={<PageSignin />} />
                    <Route path="signup" element={<PageSignup />} />
                </Route>
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="addUser" element={<AddUser />} />
                    <Route path="updateUser" element={<UpdateUser />} />
                    <Route path="listUser" element={<ListUser />} />
                    <Route path="listProducts" element={<ListProducts />} />
                    <Route path="addProducts" element={<Addproduct />} />
                    <Route path="updateProducts" element={<UpdateProduct />} />
                    <Route path="variantProducts" element={<VariantProduct />} />
                    <Route path="listComments" element={<ListComments />} />
                    <Route path="listCategories" element={<ListCategories />} />
                    <Route path="addCategories" element={<AddCategories />} />
                    <Route path="updateCategories" element={<UpdateCategories />} />
                    <Route path="listBills" element={<ListBills />} />
                    <Route path="listBanners" element={<ListBanners />} />
                    <Route path="addBanners" element={<AddBanners />} />
                    <Route path="updateBanners" element={<UpdateBanners />} />

                </Route>
                <Route path="**" element={<ErrorPage />} />
            </Routes>
        </>
    );
};

export default Router;
