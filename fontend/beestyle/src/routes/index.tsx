import MyProfile from "@/pages/(dashboard)/dashboard/profile";
import AddAttribute from "@/pages/(dashboard)/dashboard/attribute_values/add";
import ListPromotions from "@/pages/(dashboard)/dashboard/promotions/list";
import AddPromotion from "@/pages/(dashboard)/dashboard/promotions/add";
import UpdatePromotion from "@/pages/(dashboard)/dashboard/promotions/update";
// import Variant from "@/pages/(dashboard)/dashboard/products/test";


// Website pages
import LayoutAdmin from "@/pages/(dashboard)/layout";
import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import AddUser from "@/pages/(dashboard)/dashboard/user/add";
import UpdateUser from "@/pages/(dashboard)/dashboard/user/update";
import ListUser from "@/pages/(dashboard)/dashboard/user/list";
import ListCategories from "@/pages/(dashboard)/dashboard/categories/list";
import AddCategories from "@/pages/(dashboard)/dashboard/categories/add";
import UpdateCategories from "@/pages/(dashboard)/dashboard/categories/update";
import ListBanners from "@/pages/(dashboard)/dashboard/banners/list";
import AddBanners from "@/pages/(dashboard)/dashboard/banners/add";
import UpdateBanners from "@/pages/(dashboard)/dashboard/banners/update";
import AddAttributeValues from "@/pages/(dashboard)/dashboard/attribute_values/addValue";
import ListAttributeValues from "@/pages/(dashboard)/dashboard/attribute_values/list";
import UpdateAttributeValues from "@/pages/(dashboard)/dashboard/attribute_values/updateValue";
import UpdateAttribute from "@/pages/(dashboard)/dashboard/attribute_values/update";
import ListComments from "@/pages/(dashboard)/dashboard/comments/list";
import ListBills from "@/pages/(dashboard)/dashboard/bills/list";
import { Route, Routes } from "react-router-dom";
import ListProducts from "@/pages/(dashboard)/products/list";
import AddProduct from "@/pages/(dashboard)/products/add";
import UpdateProduct from "@/pages/(dashboard)/products/update";
import DetailProduct from "@/pages/(dashboard)/products/detail";


// Client
// import ErrorPage from "@/pages/(website)/404/page";
// import Search from "@/pages/(website)/_components/Search";
// import PageSignin from "@/pages/(website)/auth/signin/page";
// import PageSignup from "@/pages/(website)/auth/signup/page";
// import CheckOutPage from "@/pages/(website)/checkout/page";
// import DetailPage from "@/pages/(website)/detail/page";
// import HomePage from "@/pages/(website)/home/page";
// import LayoutWebsite from "@/pages/(website)/layout";
// import ListPage from "@/pages/(website)/list/page";
// import SearchPage from "@/pages/(website)/search/page";
// import { useState } from "react";
// import { Route, Routes } from "react-router-dom";
// import CartPage from "@/pages/(website)/cart/page";

const Router = () => {

    // const [isSearch, setIsSearch] = useState<boolean>(false)
    // const [isKeySearch, setKeySearch] = useState<string>("")
    return (
        <>
            <Routes>
                {/* Website Routes */}
                {/* <Route path="/" element={<LayoutWebsite isSearch={isSearch} setIsSearch={setIsSearch} />}>
                    <Route index element={<HomePage />} />
                    <Route path="categories/:id" element={<ListPage />} />
                    <Route path="products/:id" element={<DetailPage />} />
                    <Route path="checkout" element={<CheckOutPage />} />
                    <Route path="carts" element={<CartPage />} />
                    <Route path="signin" element={<PageSignin />} />
                    <Route path="signup" element={<PageSignup />} />
                    <Route path="search" element={<SearchPage isKeySearch={isKeySearch} />} />
                </Route> */}

                {/* Admin Routes */}
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route path="profile" element={<MyProfile />} />
                    <Route index element={<DashboardPage />} />
                    {/* bills */}
                    <Route path="listbills" element={<ListBills />} />
                    {/* comments */}
                    <Route path="listComments" element={<ListComments />} />
                    {/* banners */}
                    <Route path="addbanner" element={<AddBanners />} />
                    <Route path="listbanner" element={<ListBanners />} />
                    <Route path="updatebanner/:id" element={<UpdateBanners />} />
                    {/* users */}
                    <Route path="addUser" element={<AddUser />} />
                    <Route path="updateUser/:id" element={<UpdateUser />} />
                    <Route path="listUser" element={<ListUser />} />
                    {/* products */}
                    <Route path="listProducts" element={<ListProducts />} />
                    {/* <Route path="variant" element={<Variant />} /> */}
                    <Route path="addProducts" element={<AddProduct />} />
                    <Route path="updateProducts/:id" element={<UpdateProduct />} />
                    <Route path="detailProducts/:id" element={<DetailProduct />} />
                    {/* attribute values */}
                    <Route path="addattribute_value" element={<AddAttributeValues />} />
                    <Route path="listattribute_value" element={<ListAttributeValues />} />
                    <Route path="updateattribute_value/:id" element={<UpdateAttributeValues />} />
                    <Route path="addattribute" element={<AddAttribute />} />
                    <Route path="updateattribute/:id" element={<UpdateAttribute />} />
                    {/* categories */}
                    <Route path="listCategories" element={<ListCategories />} />
                    <Route path="addCategories" element={<AddCategories />} />
                    <Route path="updateCategories/:id" element={<UpdateCategories />} />
                    {/* promotions */}
                    <Route path="listPromotions" element={<ListPromotions />} />
                    <Route path="addPromotions" element={<AddPromotion />} />
                    <Route path="updatePromotions/:id" element={<UpdatePromotion />} />
                </Route>
            </Routes>
            {/* <Search isSearch={isSearch} setIsSearch={setIsSearch} setKeySearch={setKeySearch} /> */}
        </>
    );
};

export default Router;
