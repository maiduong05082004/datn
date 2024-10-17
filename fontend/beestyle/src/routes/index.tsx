import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import MyProfile from "@/pages/(dashboard)/dashboard/profile";

// Website pages (Lazy loading)
const HomePage = lazy(() => import("@/pages/(website)/home/page"));
const LayoutWebsite = lazy(() => import("@/pages/(website)/layout"));
const PayPage = lazy(() => import("@/pages/(website)/home/_components/PayPage"));
const CartPage = lazy(() => import("@/pages/(website)/home/_components/CartPage"));
const Signin = lazy(() => import("@/pages/signin/signin"));
const Signup = lazy(() => import("@/pages/signup/signup"));
const GoogleCallback = lazy(() => import("@/pages/GoogleCallback/GoogleCallback"));
const ErrorPage = lazy(() => import("@/pages/(website)/404/page"));

// Admin pages (Lazy loading)
const LayoutAdmin = lazy(() => import("@/pages/(dashboard)/layout"));
const DashboardPage = lazy(() => import("@/pages/(dashboard)/dashboard/page"));
const AddUser = lazy(() => import("@/pages/(dashboard)/dashboard/user/add"));
const UpdateUser = lazy(() => import("@/pages/(dashboard)/dashboard/user/update"));
const ListUser = lazy(() => import("@/pages/(dashboard)/dashboard/user/list"));
const ListProducts = lazy(() => import("@/pages/(dashboard)/dashboard/products/list"));
const AddProduct = lazy(() => import("@/pages/(dashboard)/dashboard/products/add"));
const UpdateProduct = lazy(() => import("@/pages/(dashboard)/dashboard/products/update"));
const ListComments = lazy(() => import("@/pages/(dashboard)/dashboard/comments/list"));
const ListCategories = lazy(() => import("@/pages/(dashboard)/dashboard/categories/list"));
const AddCategories = lazy(() => import("@/pages/(dashboard)/dashboard/categories/add"));
const UpdateCategories = lazy(() => import("@/pages/(dashboard)/dashboard/categories/update"));
const ListBills = lazy(() => import("@/pages/(dashboard)/dashboard/bills/list"));
const ListBanners = lazy(() => import("@/pages/(dashboard)/dashboard/banners/list"));
const AddBanners = lazy(() => import("@/pages/(dashboard)/dashboard/banners/add"));
const UpdateBanners = lazy(() => import("@/pages/(dashboard)/dashboard/banners/update"));
const AddAttributeValues = lazy(() => import("@/pages/(dashboard)/dashboard/attribute_values/add"));
const ListAttributeValues = lazy(() => import("@/pages/(dashboard)/dashboard/attribute_values/list"));
const UpdateAttributeValues = lazy(() => import("@/pages/(dashboard)/dashboard/attribute_values/update"));

const Router = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {/* Website Routes */}
                <Route path="/" element={<LayoutWebsite />}>
                    <Route index element={<HomePage />} />
                    <Route path="signin" element={<Signin />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="auth/google/callback" element={<GoogleCallback />} />
                    <Route path="pay" element={<PayPage />} />
                    <Route path="cart" element={<CartPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route path="profile" element={<MyProfile />} />
                    <Route index element={<DashboardPage />} />
                    {/* users */}
                    <Route path="addUser" element={<AddUser />} />
                    <Route path="updateUser/:id" element={<UpdateUser />} />
                    <Route path="listUser" element={<ListUser />} />
                    {/* products */}
                    <Route path="listProducts" element={<ListProducts />} />
                    <Route path="addProducts" element={<AddProduct />} />
                    <Route path="updateProducts" element={<UpdateProduct />} />
                    {/* banner */}
                    <Route path="listBanners" element={<ListBanners />} />
                    <Route path="addBanners" element={<AddBanners />} />
                    <Route path="updateBanners" element={<UpdateBanners />} />
                    {/*giá trị attribute */}
                    <Route path="addattribute" element={<AddAttributeValues />} />
                    <Route path="listattribute" element={<ListAttributeValues />} />
                    <Route path="updateattribute" element={<UpdateAttributeValues />} />
                    {/* Danh Mục */}
                    <Route path="listCategories" element={<ListCategories />} />
                    <Route path="addCategories" element={<AddCategories />} />
                    <Route path="updateCategories/:id" element={<UpdateCategories />} />
                </Route>

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Suspense>
    );
};

export default Router;
