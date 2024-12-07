import { useEffect } from "react";
import BannerMain from "./_components/bannerMain";
import ProductHot from "./_components/productHot";
import ProductNew from "./_components/productNew";
import Instagram from "./_components/instagram";

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
      <section>
        <div className="pt-[40px]">
          <div className="px-[15px] pc:px-[48px]">

            <div className="mb-[20px] lg:flex lg:justify-between lg:items-center">
              <h3 className='font-[600] text-[24px] lg:text-[32px]'>BỘ SƯU TẬP</h3>
              <div className="flex overflow-x-auto whitespace-nowrap scrollbar">
                <div className="flex gap-2.5 font-[600] justify-start mt-[10px] text-[16px] lg:text-[18px] lg:mt-0">
                  <div className="rounded-[25px] border-black border-[1px] px-[20px] py-[5px]  bg-black text-white">DENIM COLLECTION</div>
                  <div className="rounded-[25px] border-black border-[1px] px-[20px] py-[5px] ">PREMIUM & SPORT</div>
                  <div className="rounded-[25px] border-black border-[1px] px-[20px] py-[5px] ">YOUNG & HIP</div>
                </div>
              </div>
            </div>

            <div className="lg:relative">
              <div className="-mx-[15px] lg:-mx-[0]">
                <picture>
                  <img className='w-full lg:hidden' src="https://file.hstatic.net/200000642007/file/750x680_c75ac57407f243fca2808de6faa70524.jpg" alt="" />
                  <img className='w-full hidden lg:block pc:block' src="https://file.hstatic.net/200000642007/file/1614x820_76ccb179b274411685d3d1fbeab117ed.jpg" alt="" />
                </picture>
              </div>

              <div className="w-full lg:absolute top-0 lg:w-[60%] lg:right-0 lg:top-[50%] lg:translate-y-[-50%]">
                <div className="absolute -mt-[34px] bg-white p-[15px] w-full h-[90px] lg:mb-[15px] lg:h-auto lg:p-[0] lg:bg-transparent">
                  <h5 className='text-[16px] font-[600] lg:text-[18px] lg:mb-[10px]'>YOUNG & HIP</h5>
                  <h4 className='text-[24px] font-[600] lg:text-[40px] lg:leading-[45px]'>#Varsity Collection</h4>
                </div>

                <div className="w-[100%] pt-[55px]">
                  <div className="-mx-[15px] lg:-mx-[0] flex gap-2 overflow-x-auto whitespace-nowrap scrollbar">

                    {/* {home?.data?.collection_products.map((item: any) => (
                      <div className="w-[38.66%] shrink-0 relative">
                        <div className="absolute top-[16px] right-[16px]">
                          <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                            <div className="w-[24px] h-[24px]">
                              <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <picture>
                            <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${item?.variations[0]?.variation_album_images[0]})`, }}></div>
                          </picture>
                        </div>
                        <div className="w-[100%] text-wrap px-[10px] py-[16px] lg:bg-white">
                          <div className="">
                            <h4 className='description2 mb-[5px] text-[14px] font-[600]'>{item.name}</h4>
                            <div className="text-[14px] font-[700]">
                              <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                            </div>
                          </div>
                          <div className="flex gap-1 justify-start mt-[18px]">
                            <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                            <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                          </div>
                        </div>
                      </div>
                    ))} */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section>
        <div className="pt-[40px]">
          <div className="px-[15px] pc:px-[48px]">
            <h3 className='text-[24px] font-[600] mb-[20px] lg:text-[32px]'>MLB STYLING</h3>
            <div className="">
              <div className="grid grid-cols-2 grid-rows-3 gap-2.5 lg:grid-cols-3 lg:grid-rows-2 lg:gap-3.5">
                <div className="col-start-1 col-end-1">
                  <picture>
                    <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/mobile__6__21cefb32c51545fb8be9a3d454ddf822.jpg" alt="" />
                  </picture>
                </div>
                <div className="">
                  <picture>
                    <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/mobile__4__fe72810d1df646398ba14861a95402ae.jpg" alt="" />
                  </picture>
                </div>
                <div className="lg:row-start-2">
                  <picture>
                    <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/mobile__5__16747440ed8f4cd59dcd7b377660e646.jpg" alt="" />
                  </picture>
                </div>
                <div className="">
                  <picture>
                    <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/mobile_7309eb036b57471fbcdcb3fdc7331f55.jpg" alt="" />
                  </picture>
                </div>
                <div className="">
                  <picture>
                    <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/mobile__3__fef268d24c4f4dd99b4338145510196f.jpg" alt="" />
                  </picture>
                </div>
                <div className="">
                  <picture>
                    <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/mobile__2__8538d1c3c765423fb96f79338ad18900.jpg" alt="" />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* <section>
        <div className="pt-[40px]">
          <div className="px-[15px] pc:px-[48px]">
            <h3 className='text-[24px] font-[600] mb-[20px] lg:text-[32px]'>MLB VIDEO</h3>
            <div className="lg:grid lg:grid-cols-3 lg:grid-rows-1 lg:gap-8">
              <div className="">
                <picture>
                  <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/banner-2-700x800_e77f9fac246e40a68e61fe2961249d94.jpg" alt="" />
                </picture>
              </div>
              <div className="hidden lg:block">
                <picture>
                  <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/banner-2-700x800_e77f9fac246e40a68e61fe2961249d94.jpg" alt="" />
                </picture>
              </div>
              <div className="hidden lg:block">
                <picture>
                  <img className='w-[100%]' src="https://file.hstatic.net/200000642007/file/banner-2-700x800_e77f9fac246e40a68e61fe2961249d94.jpg" alt="" />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section>
        <div className="pt-[40px]">
          <div className="px-[15px] pc:px-[48px]">
            <div className="mb-[20px] flex">
              <h3 className='text-[24px] font-[600] lg:text-[32px]'>BEESTYLE STYLING</h3>
              <h3 className='text-[24px] font-[600] lg:text-[32px]'> @BEEST_YLES</h3>
            </div>
            <div className="">
              <Instagram />
            </div>
          </div>
        </div>
      </section>

      <div className="px-[15px] pc:px-[48px]">
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
      </div>
    </main>
  )
}

export default HomePage