import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import ErrorPage from "@/pages/(website)/404/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import AddUser from "@/pages/(dashboard)/dashboard/user/add";
import UpdateUser from "@/pages/(dashboard)/dashboard/user/update";

import { Route, Routes } from "react-router-dom";
import PayPage from "@/pages/(website)/home/_components/PayPage";
import CartPage from "@/pages/(website)/home/_components/CartPage";
import AddCategories from "@/pages/(dashboard)/dashboard/categories/add";
import UpdateCategories from "@/pages/(dashboard)/dashboard/categories/update";
import AddBanners from "@/pages/(dashboard)/dashboard/banners/add";
import UpdateBanners from "@/pages/(dashboard)/dashboard/banners/update";
import ListUser from "@/pages/(dashboard)/dashboard/user/list";
import ListProducts from "@/pages/(dashboard)/dashboard/products/list";
import Addproduct from "@/pages/(dashboard)/dashboard/products/add";
import UpdateProduct from "@/pages/(dashboard)/dashboard/products/update";
import ListComments from "@/pages/(dashboard)/dashboard/comments/list";
import ListCategories from "@/pages/(dashboard)/dashboard/categories/list";
import ListBills from "@/pages/(dashboard)/dashboard/bills/list";
import ListBanners from "@/pages/(dashboard)/dashboard/banners/list";
import VariantProduct from "@/pages/(dashboard)/dashboard/products/variant";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite />}>
                    <Route index element={<HomePage />} />
                    {/* <Route path="spbt" element={<Sanphambt />} /> */}
                    <Route path="pay" element={<PayPage />} />
                    <Route path="cart" element={<CartPage />} />
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
