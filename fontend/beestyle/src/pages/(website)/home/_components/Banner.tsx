import { useState } from 'react'
import { Select, Space } from 'antd'

type Props = {}

const Banner = (props: Props) => {
  const [todo, setTodo] = useState<boolean>(false)
  console.log(todo)
  return (
    <main>

      <div className="my-[15px] text-center flex justify-center lg:my-[30px]">
        <h1 className='text-[24px] font-[650] lg:text-[32px]'>Quần Áo</h1>
      </div>

      <div className="">
        <div className="*:text-[14px] font-[500] leading-5 px-[15px] relative pc:px-[48px]">
          <div style={{
            maxHeight: todo ? '100px' : '',
            overflow: 'hidden',
          }} className="">
            <p className="text-center">
              Bộ sưu tập&nbsp;
              <strong>Quần</strong>&nbsp;
              <strong>Áo MLB</strong>&nbsp;
              tại MLB Việt Nam - Thời trang thể thao đa dạng.
            </p>
            <p className="text-center">
              &nbsp;
            </p>
            <p className="text-center">
              <strong>MLB Việt Nam</strong>&nbsp;
              tự hào giới thiệu bộ sưu tập Áo MLB với thiết kế
              đa dạng từ áo phông, áo hoodie đến áo khoác, sử dụng
              chất liệu thoáng khí và co giãn để mang đến sự thoải
              mái và linh hoạt khi bạn vận động. Khám phá bộ sưu tập&nbsp;
              <strong>Quần</strong>
              &nbsp;
              <strong>Áo MLB</strong>
              &nbsp;
              và tạo nên phong cách thể thao đẳng cấp và nổi bật.
            </p>
          </div>
          <div className="w-full h-full lg:hidden">
            <div style={{ display: todo ? "" : "none" }} className="absolute h-[100px] w-[100%] bottom-[30px] bg-gradient-to-t from-white to-transparent"></div>

            <div className="mt-[10px] mb-[20px] text-center bg-white w-full h-full">
              <span style={{ display: todo ? "" : "none" }} onClick={() => setTodo(!todo)} className='cursor-pointer border-b-[#808080] border-b-[1px] pb-[2px] bg-white'>Xem thêm</span>
              <span style={{ display: todo ? "none" : "" }} onClick={() => setTodo(!todo)} className='cursor-pointer border-b-[#808080] border-b-[1px] pb-[2px]'>Rút gọn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[15px] py-[10px] mb-[20px] border-t-[##e8e8e8] border-b-[#e8e8e8] border-t-[1px] border-b-[1px] lg:py-[20px] lg:mb-[8px] lg:border-none pc:px-[48px]">
        <div className="block lg:justify-between lg:items-center lg:px-0 lg:flex">

          <div className="*:text-[12px] *:font-[500] hidden lg:block">
            <span className='text-[#787878]'>DANH MUC {'>'} </span>
            <span className='text-[#787878]'>TRANG CHU {'>'} </span>
            <span>QUAN AO</span>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center lg:border-[#E8E8E8] lg:border-[1px] lg:px-[16px] lg:py-[10px] lg:rounded-[4px]">
              <span className='mr-[5px] text-[14px] font-[500] lg:mr-[20px]'>Bộ lọc</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1.33325 2.66699H8.83325" stroke="black" stroke-linecap="square"></path><path d="M12.1665 2.66699L14.6665 2.66699" stroke="black" stroke-linecap="square"></path><path d="M7.1665 9.33301L14.6665 9.33301" stroke="black" stroke-linecap="square"></path><path d="M1.33325 9.33301H3.83325" stroke="black" stroke-linecap="square"></path><ellipse cx="5.49992" cy="9.33366" rx="1.66667" ry="1.66667" stroke="black"></ellipse><ellipse cx="10.4999" cy="2.66667" rx="1.66667" ry="1.66667" stroke="black"></ellipse></svg>
            </div>

            <div className="my-[3px] text-[14px] font-[500] lg:ml-[12px]">
              <Space wrap>
                <Select
                  defaultValue="Sắp xếp"
                  style={{ width: 120 }}
                  options={[
                    { value: 'jack', label: 'Jack' },
                    { value: 'lucy', label: 'Lucy' },
                    { value: 'Yiminghe', label: 'yiminghe' },
                    { value: 'disabled', label: 'Disabled', disabled: true },
                  ]}
                />
              </Space>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-12 lg:px-[15px] lg:gap-2 pc:px-[48px]">
        <div className="mb-[30px] col-span-2 relative lg:col-span-3 lg:mb-[40px]">
          <div className="absolute top-[16px] right-[16px]">
            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
              <div className="w-[24px] h-[24px]">
                <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="">
            <picture>
              <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
            </picture>
          </div>
          <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
            <div className="">
              <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
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
        <div className="mb-[30px] col-span-2 relative lg:col-span-3 lg:mb-[40px]">
          <div className="absolute top-[16px] right-[16px]">
            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
              <div className="w-[24px] h-[24px]">
                <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="">
            <picture>
              <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
            </picture>
          </div>
          <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
            <div className="">
              <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
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
        <div className="mb-[30px] col-span-2 relative lg:col-span-3 lg:mb-[40px]">
          <div className="absolute top-[16px] right-[16px]">
            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
              <div className="w-[24px] h-[24px]">
                <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="">
            <picture>
              <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
            </picture>
          </div>
          <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
            <div className="">
              <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
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
        <div className="mb-[30px] col-span-2 relative lg:col-span-3 lg:mb-[40px]">
          <div className="absolute top-[16px] right-[16px]">
            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
              <div className="w-[24px] h-[24px]">
                <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="">
            <picture>
              <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
            </picture>
          </div>
          <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
            <div className="">
              <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
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
      </div>

    </main>
  )
}

export default Banner