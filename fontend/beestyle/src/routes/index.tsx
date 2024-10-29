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
import ListProducts from "@/pages/(dashboard)/dashboard/Products/list";
import UpdateProduct from "@/pages/(dashboard)/dashboard/Products/update";
import AddProduct from "@/pages/(dashboard)/dashboard/Products/add";
import DetailProduct from "@/pages/(dashboard)/dashboard/Products/detail";
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
import { useState } from "react";
import ListAttribute from "@/pages/(dashboard)/dashboard/Attribute/list";
import AddAttribute from "@/pages/(dashboard)/dashboard/Attribute/add";
import UpdateAttribute from "@/pages/(dashboard)/dashboard/Attribute/update";
import AddAttributeValues from "@/pages/(dashboard)/dashboard/Attribute/Attribute_value/add";
import UpdateAttributeValues from "@/pages/(dashboard)/dashboard/Attribute/Attribute_value/update";
import AddtributeGroup from "@/pages/(dashboard)/dashboard/Attribute_Group/add";
import ListAttributeGroup from "@/pages/(dashboard)/dashboard/Attribute_Group/list";
import UpdateAttributeGroup from "@/pages/(dashboard)/dashboard/Attribute_Group/update";
import CartPage from "@/pages/(website)/cart/page";

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
                    <Route path="checkout" element={<CheckOutPage />} />
                    <Route path="signin" element={<PageSignin />} />
                    <Route path="signup" element={<PageSignup />} />
                    <Route path="search" element={<SearchPage isKeySearch={isKeySearch}/>} />
                    <Route path="carts" element={<CartPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route path="profile" element={<MyProfile />} />
                    <Route index element={<DashboardPage />} />
                    {/* bills */}
                    <Route path="bill/list" element={<ListBill />} />
                    <Route path="bill/detail/:id" element={<DetailBill />} />
                    {/* comments */}
                    <Route path="comment/list" element={<ListComments />} />
                    {/* banner */}
                    <Route path="banner/add" element={<AddBanners />} />
                    <Route path="banner/list" element={<ListBanners />} />
                    <Route path="banner/update/:id" element={<UpdateBanners />} />
                    {/* users */}
                    <Route path="user/add" element={<AddUser />} />
                    <Route path="user/list" element={<ListUser />} />
                    <Route path="user/update/:id" element={<UpdateUser />} />
                    {/* products */}
                    <Route path="products/list" element={<ListProducts />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="products/update/:id" element={<UpdateProduct />} />
                    <Route path="products/detail/:id" element={<DetailProduct />} />
                    {/* banner */}
                    <Route path="banner/list" element={<ListBanners />} />
                    <Route path="banner/add" element={<AddBanners />} />
                    <Route path="banner/update/:id" element={<UpdateBanners />} />
                    {/* attribute_group */}
                    <Route path="attribute_group/add" element={<AddtributeGroup />} />
                    <Route path="attribute_group/list" element={<ListAttributeGroup />} />
                    <Route path="attribute_group/update/:id" element={< UpdateAttributeGroup />} />
                    {/* attribute */}
                    <Route path="attribute/add" element={<AddAttribute />} />
                    <Route path="attribute/list" element={<ListAttribute />} />
                    <Route path="attribute/update/:id" element={< UpdateAttribute />} />
                    {/*giá trị attribute */}
                    <Route path="attribute_value/add" element={<AddAttributeValues />} />
                    <Route path="attribute_value/update/:id" element={< UpdateAttributeValues />} />
                    {/* Danh Mục */}
                    <Route path="category/list" element={<ListCategories />} />
                    <Route path="category/add" element={<AddCategories />} />
                    <Route path="category/update/:id" element={<UpdateCategories />} />
                    {/* promotions */}
                    <Route path="promotions/list" element={<ListPromotions />} />
                    <Route path="promotions/add" element={<AddPromotion />} />
                    <Route path="promotions/update/:id" element={<UpdatePromotion />} />
                </Route>

            </Routes>
            <Search isSearch={isSearch} setIsSearch={setIsSearch} setKeySearch={setKeySearch}/>
        </>
    );
};

export default Router;