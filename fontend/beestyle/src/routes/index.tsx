import AddAttribute from "@/pages/(dashboard)/dashboard/attribute_values/add";
import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import MyProfile from "@/pages/(dashboard)/dashboard/profile";
import AddPromotion from "@/pages/(dashboard)/dashboard/promotions/add";
import ListPromotions from "@/pages/(dashboard)/dashboard/promotions/list";
import UpdatePromotion from "@/pages/(dashboard)/dashboard/promotions/update";
import AddUser from "@/pages/(dashboard)/dashboard/user/add";
import UpdateUser from "@/pages/(dashboard)/dashboard/user/update";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import { Route, Routes } from "react-router-dom";

import AddAttributeValues from "@/pages/(dashboard)/dashboard/attribute_values/addValue";
import UpdateAttribute from "@/pages/(dashboard)/dashboard/attribute_values/update";
import AddBanners from "@/pages/(dashboard)/dashboard/banners/add";
import ListBanners from "@/pages/(dashboard)/dashboard/banners/list";
import UpdateBanners from "@/pages/(dashboard)/dashboard/banners/update";
import ListBills from "@/pages/(dashboard)/dashboard/bills/list";
import AddCategories from "@/pages/(dashboard)/dashboard/categories/add";
import ListCategories from "@/pages/(dashboard)/dashboard/categories/list";
import UpdateCategories from "@/pages/(dashboard)/dashboard/categories/update";
import ListComments from "@/pages/(dashboard)/dashboard/comments/list";
import AddProduct from "@/pages/(dashboard)/dashboard/products/add";
import ListProducts from "@/pages/(dashboard)/dashboard/products/list";
import UpdateProduct from "@/pages/(dashboard)/dashboard/products/update";
import ListUser from "@/pages/(dashboard)/dashboard/user/list";
import Search from "@/pages/(website)/_components/Search";
import PageSignin from "@/pages/(website)/auth/signin/page";
import PageSignup from "@/pages/(website)/auth/signup/page";
import CheckOutPage from "@/pages/(website)/checkout/page";
import DetailPage from "@/pages/(website)/detail/page";
import ListPage from "@/pages/(website)/list/page";
import SearchPage from "@/pages/(website)/search/page";
import { useState } from "react";
import CartPage from "@/pages/(website)/cart/page";
import WishlistPage from "@/pages/(website)/account/_components/wishlist";
import AccountPage from "@/pages/(website)/account/page";
import ViewAccount from "@/pages/(website)/account/_components/view";
import InfoPage from "@/pages/(website)/account/_components/info";
import RecentlyPage from "@/pages/(website)/account/_components/recently";
import AddressesPage from "@/pages/(website)/account/_components/addresses";

const Router = () => {

    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [isKeySearch, setKeySearch] = useState<string>("")
    return (

        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite isSearch={isSearch} setIsSearch={setIsSearch} />}>
                    <Route index element={<HomePage />} />
                    <Route path="categories/:id" element={<ListPage />} />
                    <Route path="products/:id" element={<DetailPage />} />
                    <Route path="checkouts" element={<CheckOutPage />} />
                    <Route path="signin" element={<PageSignin />} />
                    <Route path="signup" element={<PageSignup />} />
                    <Route path="search" element={<SearchPage isKeySearch={isKeySearch}/>} />
                    <Route path="carts" element={<CartPage />} />
                    <Route path="account" element={<AccountPage />}>
                        <Route index element={<ViewAccount />} />
                        <Route path="wishlist" element={<WishlistPage />} />
                        <Route path="info" element={<InfoPage />} />
                        <Route path="recently" element={<RecentlyPage />} />
                        <Route path="addresses" element={<AddressesPage />} />
                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route path="profile" element={<MyProfile />} />
                    <Route index element={<DashboardPage />} />
                    {/* bills */}
                    <Route path="listbills" element={<ListBills />} />
                    {/* comments */}
                    <Route path="listComments" element={<ListComments />} />
                    {/* bills */}
                    <Route path="addbanner" element={<AddBanners />} />
                    <Route path="listbanner" element={<ListBanners />} />
                    <Route path="updatebanner/:id" element={<UpdateBanners />} />
                    {/* users */}
                    <Route path="addUser" element={<AddUser />} />
                    <Route path="updateUser/:id" element={<UpdateUser />} />
                    <Route path="listUser" element={<ListUser />} />
                    {/* products */}
                    <Route path="listProducts" element={<ListProducts />} />
                    <Route path="addProducts" element={<AddProduct />} />
                    <Route path="updateProducts/:id" element={<UpdateProduct />} />
                    {/* banner */}
                    <Route path="listBanners" element={<ListBanners />} />
                    <Route path="addBanners" element={<AddBanners />} />
                    <Route path="updateBanners" element={<UpdateBanners />} />
                    {/*giá trị attribute */}
                    <Route path="addattribute_value" element={<AddAttributeValues />} />

                    <Route path="addattribute" element={<AddAttribute />} />
                    <Route path="updateattribute/:id" element={< UpdateAttribute />} />
                    {/* Danh Mục */}
                    <Route path="listCategories" element={<ListCategories />} />
                    <Route path="addCategories" element={<AddCategories />} />
                    <Route path="updateCategories/:id" element={<UpdateCategories />} />
                    {/* promotions */}
                    <Route path="listPromotions" element={<ListPromotions />} />
                    <Route path="addPromotions" element={<AddPromotion />} />
                    <Route path="updatePromotions/:id" element={<UpdatePromotion />} />
                </Route>

            </Routes>
            <Search isSearch={isSearch} setIsSearch={setIsSearch} setKeySearch={setKeySearch}/>
        </>
    );
};

export default Router;