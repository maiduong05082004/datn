import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import MyProfile from "@/pages/(dashboard)/dashboard/profile";
import AddPromotion from "@/pages/(dashboard)/dashboard/promotions/add";
import ListPromotions from "@/pages/(dashboard)/dashboard/promotions/list";
import UpdatePromotion from "@/pages/(dashboard)/dashboard/promotions/update";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import { Route, Routes } from "react-router-dom";
// Bill
import ListBill from "@/pages/(dashboard)/dashboard/Bill/list";
import DetailBill from "@/pages/(dashboard)/dashboard/Bill/detail";
// banner
import AddBanners from "@/pages/(dashboard)/dashboard/Banner/add";
import ListBanners from "@/pages/(dashboard)/dashboard/Banner/list";
import UpdateBanners from "@/pages/(dashboard)/dashboard/Banner/update";
import ListUser from "@/pages/(dashboard)/dashboard/Users/list";
import AddUser from "@/pages/(dashboard)/dashboard/Users/add";
import UpdateUser from "@/pages/(dashboard)/dashboard/Users/update";
import ListComments from "@/pages/(dashboard)/dashboard/Comment/list";
import ListProducts from "@/pages/(dashboard)/dashboard/products/list";
import UpdateProduct from "@/pages/(dashboard)/dashboard/products/update";
import AddProduct from "@/pages/(dashboard)/dashboard/products/add";
import DetailProduct from "@/pages/(dashboard)/dashboard/products/detail";
import AddCategories from "@/pages/(dashboard)/dashboard/Category/add";
import ListCategories from "@/pages/(dashboard)/dashboard/Category/list";
import UpdateCategories from "@/pages/(dashboard)/dashboard/Category/update";
import Search from "@/pages/(website)/_components/Search";
import PageSignin from "@/pages/(website)/auth/signin/page";
import PageSignup from "@/pages/(website)/auth/signup/page";
import CheckOutPage from "@/pages/(website)/checkout/page";
import DetailPage from "@/pages/(website)/detail/page";
import ListPage from "@/pages/(website)/list/page";
import SearchPage from "@/pages/(website)/search/page";
import { useState, useEffect } from "react";
import ListAttribute from "@/pages/(dashboard)/dashboard/Attribute/list";
import Shiping from "@/pages/(dashboard)/dashboard/Bill/shiping";
import AddAttribute from "@/pages/(dashboard)/dashboard/Attribute/add";
import UpdateAttribute from "@/pages/(dashboard)/dashboard/Attribute/update";
import AddAttributeValues from "@/pages/(dashboard)/dashboard/Attribute/Attribute_value/add";
import UpdateAttributeValues from "@/pages/(dashboard)/dashboard/Attribute/Attribute_value/update";
import AddtributeGroup from "@/pages/(dashboard)/dashboard/Attribute_Group/add";
import ListAttributeGroup from "@/pages/(dashboard)/dashboard/Attribute_Group/list";
import UpdateAttributeGroup from "@/pages/(dashboard)/dashboard/Attribute_Group/update";
import CartPage from "@/pages/(website)/cart/page";
import WishlistPage from "@/pages/(website)/account/_components/wishlist";
import AccountPage from "@/pages/(website)/account/page";
import ViewAccount from "@/pages/(website)/account/_components/view";
import InfoPage from "@/pages/(website)/account/_components/info";
import RecentlyPage from "@/pages/(website)/account/_components/recently";
import AddressesPage from "@/pages/(website)/account/_components/addresses";
import App from "@/pages/(dashboard)/dashboard/Bill/app";
import Detailship from "@/pages/(dashboard)/dashboard/Bill/detailship";
import DeatilConfirm from "@/pages/(dashboard)/dashboard/Bill/detailConfirm"
import Comments from "@/pages/(dashboard)/dashboard/products/comments";
import DetailUser from "@/pages/(dashboard)/dashboard/Users/detail";
import PrivateRouter from "./PrivateRoute";
import OrderDetail from "@/pages/(website)/account/_components/orderDetail";
import ErrorPage from "@/pages/(website)/404/page";
// import CartPage from "@/pages/(website)/cart/page";
import InventoryManagement from "@/pages/(dashboard)/dashboard/Inventory/list";
import Signin from "@/pages/(dashboard)/dashboard/auth.tsx/signin";
import ForgotPasswordPage from "@/pages/(website)/ForgotPassword/page";
import ResetPasswordPage from "@/pages/(website)/ResetPassword/page";
import axios from "axios";
import PrivateRoute from './PrivateRoute';

const Router = () => {

    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [isKeySearch, setKeySearch] = useState<string>("")
    const [userRole, setUserRole] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/api/client/auth/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    setUserRole(response.data.user.role)
                } catch (error) {
                    console.error("Error fetching user profile:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (

        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite isSearch={isSearch} setIsSearch={setIsSearch} />}>
                    <Route index element={<HomePage />} />
                    <Route path="categories/:id" element={<ListPage />} />
                    <Route path="products/:id" element={<DetailPage />} />
                    <Route path="checkouts" element={<CheckOutPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="search" element={<SearchPage isKeySearch={isKeySearch} />} />
                    <Route path="carts" element={<CartPage />} />
                    <Route path="account" element={<AccountPage />}>
                        <Route index element={<ViewAccount />} />
                        <Route path="wishlist" element={<WishlistPage />} />
                        <Route path="info" element={<InfoPage />} />
                        <Route path="recently" element={<RecentlyPage />} />
                        <Route path="addresses" element={<AddressesPage />} />
                        <Route path="orders/:oderId" element={<OrderDetail />} />
                    </Route>
                    <Route path="*" element={<ErrorPage />} />
                </Route>
                <Route path="signin" element={<PageSignin />} />
                <Route path="signup" element={<PageSignup />} />

                {/* Admin Routes */}
                <Route path="admin" element={<Signin />} />
                <Route path="admin/dashboard" element={
                    <PrivateRoute userRole={userRole}>
                        <LayoutAdmin />
                    </PrivateRoute>
                }>
                    <Route index element={<DashboardPage />} />
                    <Route path="profile" element={<MyProfile />} />
                    {/* bills */}
                    <Route path="bill/app" element={<App />} />
                    <Route path="bill/list" element={<ListBill />} />
                    <Route path="bill/detail/:id" element={<DetailBill />} />
                    <Route path="bill/detailship/:id" element={<Detailship />} />
                    <Route path="bill/detailConfirm/:id" element={<DeatilConfirm />} />
                    <Route path="bill/shiping/:id" element={<Shiping />} />
                    {/* <Route path="bill/address" element={<AddAddresses />} /> */}
                    {/* comments */}
                    <Route path="comment/list" element={<ListComments />} />
                    {/* banners */}
                    <Route path="banner/add" element={<AddBanners />} />
                    <Route path="banner/list" element={<ListBanners />} />
                    <Route path="banner/update/:id" element={<UpdateBanners />} />
                    {/* users */}
                    <Route path="user/add" element={<AddUser />} />
                    <Route path="user/list" element={<ListUser />} />
                    <Route path="user/detail/:id" element={<DetailUser />} />
                    <Route path="user/update/:id" element={<UpdateUser />} />
                    {/* products */}
                    <Route path="products/list" element={<ListProducts />} />
                    <Route path="comments/list/:id" element={<Comments />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="products/update/:id" element={<UpdateProduct />} />
                    <Route path="products/detail/:id" element={<DetailProduct />} />
                    {/* attribute_group */}
                    <Route path="attribute_group/add" element={<AddtributeGroup />} />
                    <Route path="attribute_group/list" element={<ListAttributeGroup />} />
                    <Route path="attribute_group/update/:id" element={<UpdateAttributeGroup />} />
                    {/* attribute */}
                    <Route path="attribute/add" element={<AddAttribute />} />
                    <Route path="attribute/list" element={<ListAttribute />} />
                    <Route path="attribute/update/:id" element={<UpdateAttribute />} />
                    {/* attribute_value */}
                    <Route path="attribute_value/add" element={<AddAttributeValues />} />
                    <Route path="attribute_value/update/:id" element={<UpdateAttributeValues />} />
                    {/* categories */}
                    <Route path="category/list" element={<ListCategories />} />
                    <Route path="category/add" element={<AddCategories />} />
                    <Route path="category/update/:id" element={<UpdateCategories />} />
                    {/* promotions */}
                    <Route path="promotions/list" element={<ListPromotions />} />
                    <Route path="promotions/add" element={<AddPromotion />} />
                    <Route path="promotions/update/:id" element={<UpdatePromotion />} />
                    {/* inventory */}
                    <Route path="inventory/list" element={<InventoryManagement />} />
                </Route>
            </Routes>
            <Search isSearch={isSearch} setIsSearch={setIsSearch} setKeySearch={setKeySearch} />
        </>
    );
};

export default Router;