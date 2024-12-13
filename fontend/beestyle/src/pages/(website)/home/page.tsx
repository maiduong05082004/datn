import { useEffect } from "react";
import BannerMain from "./_components/bannerMain";
import ProductHot from "./_components/productHot";
import ProductNew from "./_components/productNew";
import Instagram from "./_components/instagram";
import Collection from "./_components/collection";

const HomePage = () => {

  // Load dau trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <BannerMain />
      <ProductNew />
      <ProductHot />
      <Collection />
      <Instagram />
      {/* <div className="px-[15px] pc:px-[48px]">
        <div className="py-[40px]">
          <div className="text-center items-center">
            <h4 className='text-[20px] mb-[5px] font-[700]'>ĐĂNG KÝ BẢN TIN CỦA CHÚNG TÔI</h4>
            <p className='mb-[20px] text-[14px]'>Hãy cập nhật các tin tức thời trang về sản phẩm, BST sắp ra mắt chương
              trình khuyến mại đặc biệt và xu hướng thời trang mới nhất hàng tuần của chúng tôi.</p>
          </div>
          <form action="" className='border-black border-solid rounded-[3px] border-[2px] mx-auto lg:w-[500px]'>
            <input className='py-[10px] px-[48px] ' type="text" name="" id="" placeholder='Nhập email đăng ký nhận tin' />
            <button className='font-[600] text-[14px] float-right py-[12px] px-[48px] bg-black  text-white'>ĐĂNG KÝ</button>
          </form>
        </div>
      </div> */}
       <div className="px-[15px] pc:px-[48px]">
        <div className="py-[40px]">
          <div className="elfsight-container">
          <script src="https://static.elfsight.com/platform/platform.js" async></script>
          <div className="elfsight-app-523443c0-5350-4025-8263-fee3e8e18c35" data-elfsight-app-lazy></div>
          </div>
        </div>
        </div>
    </main>
  )
}

export default HomePage