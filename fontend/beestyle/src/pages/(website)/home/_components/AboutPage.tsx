import React from 'react'

type Props = {}

const AboutPage = (props: Props) => {
  return (
    <body className='font-sans'>
        <div className='lg:h-[304px] flex justify-center items-center bg-cover bg-center' style={{ backgroundImage: "url('https://bizweb.dktcdn.net/100/446/974/files/banner-mlb-viet-nam-65451178-c358-4dee-aad8-b259b2143193.png?v=1716531331367')", }}>
          <div className='min-w-full h-[48px] lg:h-auto bg-[#747474] lg:bg-transparent lg:block flex items-center justify-center' >
            <div className='text-center text-[30px] text-white lg:block hidden'>MLB Vietnam | Thời Trang MLB Chính Hãng</div>
            <div className='text-[12px] text-white flex gap-3 items-center justify-center'>
              <a href="/">Trang Chủ</a>
              /
              <a href="/">MLB Việt Nam</a>
            </div>
          </div>
        </div>
      {/* banner header */}
      {/* post 1 */}
      <div className='pl-2 pr-2'>
      <div className='lg:grid grid-cols-2 gap-3 pb-6'>
        <div className='pt-[30px] lg:pl-2'>
          <img src="https://bizweb.dktcdn.net/100/446/974/articles/giay-mlb-nu.png?v=1718267774187" alt="" />
        </div>
        <div className='pt-5 ml-2 mr-2 '>
          <a className='text-[32px] text-[#231f20] font-semibold' href="" title='Top Những Mẫu Giày MLB Nữ Chính Hãng Được Yêu Thích Nhất Hiện Nay!'>Top Những Mẫu Giày MLB Nữ Chính Hãng Được Yêu Thích Nhất Hiện Nay!</a>
          <p className='day mb-0 mb-lg-3 pt-3'>Đăng Bởi:<b>MLB Vietnam - 13/06/2024</b></p>
          <div className='sum text-justify text-[20px] lg:text-[16px] text-[#212529] font-400 pt-4 pb-5'>


            Thời trang MLB Korea từ xưa đến nay luôn là người bạn đồng hành tuyệt vời dành cho phái nữ. Từ quần áo, phụ kiện hay giày dép, các bạn nữ cá tính của MLB luôn có một kho tàng thời trang to lớn để lựa chọn và sử dụng. Ngay tại đây, cùng khám phá xem đâu là Những Mẫu Giày MLB Nữ Được Yêu Thích Nhất Hiện Nay nhé!
            Những mẫu giày MLB chính hãng dành cho nữ


            Đa dạng trong thiết kế, kiểu dáng sang trọng
            Nói về Giày MLB thời trang dành cho phái nữ, thương hiệu thời trang Hàn Quốc có hẳn một bộ sưu tập đồ sộ đủ kiểu dáng và đầy đủ màu sắc tùy theo sở thích và cá tính riêng của mỗi người. Có thể nói là bất kỳ kiểu giày nào mà MLB tung ra cũng phù hợp với các bạn gái trẻ...

          </div>
        </div>
      </div>
      <div className='border border-black w-[99%] m-auto opacity-20'></div>

      {/* post 2 */}
      <div className='lg:grid grid-cols-2 gap-3 pb-6'>
        <div className='pt-[30px] order-2 lg:order-1 lg:pr-2'>
          <img src="https://bizweb.dktcdn.net/100/446/974/articles/nang-tam-phong-cach-voi-bst-tui-denim-new-york-yankees.jpg?v=1717747236583" alt="" />
        </div>
        <div className='pt-5 pl-2'>
          <a className='text-[32px] text-[#231f20] font-semibold' href="" title='Nâng Tầm Phong Cách với Bộ Sưu Tập Túi Basic Denim New York Yankees'>Nâng Tầm Phong Cách với Bộ Sưu Tập Túi Basic Denim New York Yankees</a>
          <p className='day mb-0 mb-lg-3 pt-3'>Đăng Bởi:<b>MLB Vietnam - 10/06/2024</b></p>
          <div className='sum text-justify text-[20px] lg:text-[16px] text-[#212529] font-400 pt-4 pb-5'>


            Xu hướng của thời trang thời thượng, hiện đại, những chiếc túi của MLB không chỉ là items đi kèm mà còn là người bạn không thể thiếu trong tủ đồ thời trang của bạn. Với lối thiết kế sáng tạo và sự chọn lọc màu sắc tinh tế, đã khiến cho các mẫu túi của MLB không thể không cháy hàng sau khi được tung bán. Các nàng chắc hẳn sẽ rất mong chờ các sản phẩm mới trong mục bộ sưu tập túi của MLB đúng không nào? Vậy thì cùng tìm hiểu về Bộ sưu tập Túi MLB Korea Basic Denim Hobo Bag New York Yankees mới nhất và hứa hẹn sẽ hot hit trong thời gian tới!
            Bộ sưu tập Túi MLB Korea Basic Denim Hobo Bag New York Yankees

            Tại sao đây lại là bộ sưu tập sản phẩm đầy hứa hẹn giúp cho bạn nâng tầm...

          </div>

        </div>
      </div>
      <div className='border border-black w-[99%] m-auto opacity-20'></div>
      </div>

      {/* post 3 */}
      <div className='lg:pl-2 lg:pr-2 pl-2 pr-2 lg:grid grid-cols-4'>
        <div className='lg:p-[10px]'>
          <div className='pt-[30px]'>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/giay-mlb-made-in-vietnam.png?v=1716134348793" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Bùng Nổ Phong Cách với Giày MLB Made in <p className='lg:flex'>...</p></a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 06/06/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5 '>
              Bạn đang tìm kiếm món phụ kiện nâng tầm phong cách, tạo dấu ấn mới cho cá tính thời trang của riêng mình? Không cần đ...
            </div>
          </div>
        </div>


        {/* post 4 */}
        <div className='lg:p-[10px]'>
          <div className='pt-[30px]'>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/tui-mlb-trang.png?v=1716446675247" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Túi MLB Trắng: Điểm Nhấn Hoàn Hảo Cho<p className='lg:flex'>...</p></a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 03/06/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5'>

              Túi MLB vẫn luôn là cái tên được nhắc đến khi các tín đồ thời trang muốn mua sắm, làm mới bản thân. Với chất lượng ca...
            </div>
          </div>
        </div>


        {/* post 5 */}
        <div className='lg:p-[10px]'>
          <div className='pt-[30px]'>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/tui-mlb-cho-nam-bieu-tuong-phong-cach-va-su-thanh-lich.png?v=1716103269103" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Túi MLB Cho Nam: Biểu Tượng Phong Cách v<p className='lg:flex'>...</p></a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 03/06/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5'>

              Thời trang là không giới hạn. Có thể nói điều đó vẫn luôn đúng trong khuôn khổ và triết lý thời trang của MLB Korea. ...
            </div>
          </div>
        </div>


        {/* post 6 */}
        <div className='lg:p-[10px]'>
          <div className='pt-[30px]'>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/blog-1000x522-748e82b6-f758-429c-99f6-d86880444282.png?v=1716012448410" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Khám Phá Phong Cách Độc Đáo với Túi MLB <p className='lg:flex'>...</p></a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 18/05/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5'>

              MLB vẫn luôn là hãng thời trang được nhiều bạn trẻ săn đón nhất nhờ những thiết kế độc đáo, tiện lợi nhưng không quên...
            </div>
          </div>
        </div>

        {/* post 7 */}
        <div className='lg:p-[10px]'>
          <div className=''>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/blog-1000x522-4e88ede8-2c6f-43b9-8b32-109a4f22754a.png?v=1714590228037" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Bộ Sưu Tập 24SS MLB DENIM COLLECTION <p className='lg:flex'>...</p></a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 18/05/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5'>

              Hãy để đồ Jeans đầy tính "bụi" định hình phong cách ăn mặc của bạn. Vốn từ lâu, bộ outfit Jeans đã trở thành một phần...
            </div>
          </div>
        </div>

        {/* post 8 */}

        <div className='lg:p-[10px]'>
          <div className=''>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/blog-1000x522-ed800e0f-e570-4e45-b2a7-b41ca064accd.png?v=1712593226130" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Sự Kết Hợp Hoàn Hảo Giữa Phong Cách & <p className='lg:flex'>...</p></a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 18/05/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5'>

              Với giới trẻ hiện đại, giày không chỉ là món phụ kiện phục vụ cho mục đích đi lại, nó còn là dấu ấn để các bạn trẻ tạ...
            </div>
          </div>
        </div>

        {/* post 9 */}
        <div className='lg:p-[10px]'>
          <div className=''>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/blog-1000x522-9cbdbf8c-665f-426b-a016-95d34f82c5fa.png?v=1712249571253" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Khám Phá Sự Dịu Dàng và Phong Cách Của<p className='lg:flex'>...</p> </a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 18/05/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5'>
              Gam màu hồng tuy không phải là gam màu dễ phối đồ, nhưng khó có thể cưỡng lại sức hút nổi trội của nó. Với những ai y...
            </div>
          </div>
        </div>
        {/* post 10 */}
        <div className='lg:p-[10px]'>
          <div className=''>
            <img src="https://bizweb.dktcdn.net/100/446/974/articles/blog-1000x522-afaf234b-1a41-47ab-b8ec-b8c873f9ed06.png?v=1712590875847" alt="" />
          </div>
          <div className='pt-5'>
            <a className='text-[16px] text-[#231f20] font-bold flex gap-1' href="">Bộ Sưu Tập Giày MLB BigBall Chunky Windo <p className='lg:flex'>...</p></a>
            <p className='day mb-0 mb-lg-3 pt-3 lg:hidden'>Đăng Bởi:<b>MLB Vietnam - 18/05/2024</b></p>
            <div className='sum text-justify text-[0.95rem] text-[#bdbdbd] font-400 pt-4 pb-5'>

              Vốn là một trong những dòng sản phẩm chủ lực của MLB Korea, mẫu giày BigBall Chunky được xem là biểu tượng đại diện c...
            </div>
          </div>
        </div>
      </div>
      {/* button */}
      <div className='flex justify-center items-center gap-2 pt-5 pb-5'>
        <a href='#' className='bg-[#420500] text-white w-[36px] h-[36px] hover:text-white flex items-center justify-center'>1</a>
        <a href='#' className='bg-[#f3f5f7] w-[36px] h-[36px] hover:bg-[#420500] hover:text-white flex items-center justify-center'>2</a>
        <a href='#' className='bg-[#f3f5f7] w-[36px] h-[36px] hover:bg-[#420500] hover:text-white flex items-center justify-center'>3</a>
        <a href='#' className='bg-[#f3f5f7] w-[36px] h-[36px] hover:bg-[#420500] hover:text-white flex items-center justify-center'>...</a>
        <a href='#' className='bg-[#f3f5f7] w-[36px] h-[36px] hover:bg-[#420500] hover:text-white flex items-center justify-center'>9</a>
        <a href='#' className='bg-[#f3f5f7] w-[36px] h-[36px] hover:bg-[#420500] hover:text-white flex items-center justify-center'>»</a>

      </div>
    </body>
  )
}

export default AboutPage