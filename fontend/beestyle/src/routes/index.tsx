import { Route, Routes } from "react-router-dom";
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
import Signin from "@/pages/signin/signin";
import Signup from "@/pages/signup/signup";
import GoogleCallback from "@/pages/GoogleCallback/GoogleCallback";
import AddUser from "@/pages/(dashboard)/dashboard/user/add";
import UpdateUser from "@/pages/(dashboard)/dashboard/user/update";
import PayPage from "@/pages/(website)/home/_components/PayPage";
import CartPage from "@/pages/(website)/home/_components/CartPage";
import AddCategories from "@/pages/(dashboard)/dashboard/categories/add";
import ListCategories from "@/pages/(dashboard)/dashboard/categories/list";
import UpdateCategories from "@/pages/(dashboard)/dashboard/categories/update";
import ListComments from "@/pages/(dashboard)/dashboard/comments/list";
import AddProduct from "@/pages/(dashboard)/dashboard/products/add";
import ListProducts from "@/pages/(dashboard)/dashboard/products/list";
import UpdateProduct from "@/pages/(dashboard)/dashboard/products/update";
import ListComments from "@/pages/(dashboard)/dashboard/comments/list";
import ListCategories from "@/pages/(dashboard)/dashboard/categories/list";
import ListBills from "@/pages/(dashboard)/dashboard/bills/list";
import ListBanners from "@/pages/(dashboard)/dashboard/banners/list";
import VariantProduct from "@/pages/(dashboard)/dashboard/products/variant";
import AddBanners from "@/pages/(dashboard)/dashboard/banners/add";
import UpdateBanners from "@/pages/(dashboard)/dashboard/banners/update";
import ErrorPage from "@/pages/(website)/404/page";
import Search from "@/pages/(website)/_components/Search";
import ListUsers from "@/pages/(dashboard)/dashboard/user/list";

const Router = () => {

    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [isKeySearch, setKeySearch] = useState<string>("")
    return (

        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite isSearch={isSearch} setIsSearch={setIsSearch} />}>
                    <Route index element={<HomePage />} />
                    <Route path="signin" element={<Signin />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="auth/google/callback" element={<GoogleCallback />} />
                    {/* <Route path="spbt" element={<Sanphambt />} /> */}
                    <Route path="pay" element={<PayPage />} />
                    <Route path="cart" element={<CartPage />} />
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
                    <Route path="updateUser" element={<UpdateUser />} />
                    <Route path="listUser" element={<ListUsers />} />
                    {/* products */}
                    <Route path="listProducts" element={<ListProducts />} />
                    <Route path="addProducts" element={<AddProduct />} />
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
            <Search isSearch={isSearch} setIsSearch={setIsSearch} setKeySearch={setKeySearch}/>
        </>
    );
};

export default Router;