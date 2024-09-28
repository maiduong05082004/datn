import React from 'react'
type Props = {}

const PayPage = (props: Props) => {
    return (
        <>
            <div className='lg:flex lg:justify-between lg:items-center lg:relative'>
                <div className='flex justify-center pt-4 pb-4 lg:flex lg:justify-start lg:px-[80px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="84" height="24" viewBox="0 0 84 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.6027 0L17.7745 10.585L14.1671 0H6.94734V0.005L5.41862 0L6.33686 2.365L1.14528 19.9L0 24H7.24501L10.6203 12.505L13.1177 18.435H17.8199L23.8036 12.505L20.4283 24H27.7742L34.8224 0H27.6027ZM75.8708 7.25C75.5933 8.195 74.67 9.205 72.6519 9.205H68.0758L69.2261 5.295H73.8022C75.8153 5.295 76.1483 6.305 75.8708 7.25ZM73.5499 16.585C73.2573 17.595 72.2583 18.71 70.2402 18.71H65.2908L66.5269 14.495H71.4814C73.4944 14.495 73.8526 15.575 73.555 16.585H73.5499ZM83.1208 7.04C84.3317 2.895 82.031 0 75.8203 0H61.86L62.7884 2.2L57.1831 21.68L54.7714 24H69.4078C74.7356 24 79.5336 23.5 80.8807 18.915C81.8696 15.545 80.8858 12.69 79.8464 12.08C80.916 11.575 82.3186 9.77 83.1208 7.04ZM41.1896 18.74H51.3709H51.376C51.418 18.7175 51.4112 18.7212 51.3897 18.733C51.2824 18.7916 50.8087 19.0503 54.2568 17.225L52.1984 23.995H30.6853L32.9961 21.69L38.7527 2.32L37.7891 0H46.694L41.1896 18.74Z" fill="black"></path>
                    </svg>
                </div>
                <ul className='lg:flex lg:justify-center lg:items-center absolute left-1/2 transform -translate-x-1/2 hidden'>
                    <li className='lg:flex'>
                        <a className='lg:text-[14px]'>Giỏ Hàng</a>
                        <svg className='lg:flex lg:ml-[15px] mr-[20px]' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.75L13.75 10L7.5 16.25" stroke="#2E2E2E" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </li>
                    <li>
                        <a className='lg:uppercase lg:font-bold'>Thông tin giao hàng</a>
                    </li>
                </ul>
            </div>

            <div className='lg:px-[80px] lg:py-[64px]'>
                <div className='lg:grid lg:grid-cols-800-481 gap-[80px]'>
                    <div className='lg:order-2'>
                        <div className='px-4 pb-4'>
                            <div>
                                <div className='flex justify-between pb-4 lg:hidden'>
                                    <div className='flex gap-1 items-center'>
                                        <span className='text-[16px] text-[#2e2e2e] font-sans font-bold'>TÓM TẮT ĐƠN HÀNG</span>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"></path> </svg>
                                    </div>
                                    <div>
                                        <span className='text-[#2E2E2E] text-[14px] font-sans font-bold'>1,690,000₫</span>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex gap-1 items-center'>
                                        <span className='text-[18px] text-[#2e2e2e] font-sans font-bold'>TÓM TẮT ĐƠN HÀNG</span>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"></path> </svg>
                                    </div>
                                    <div>
                                        <span className='text-[#2E2E2E] text-[20px] font-sans font-bold'>1,690,000₫</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-[#f7f8f9] px-4 pt-4'>
                            <div className='flex justify-between gap-3 items-center pb-4'>
                                <div className='w-25 h-25'>
                                    <img
                                        src="https://product.hstatic.net/200000642007/product/43bks_3atsv2143_1_5c2f075f77744e7c91c793ac923bc7ec_8dffdf7d799d4d6e98aec03b06492ae4_grande.jpg"
                                        alt="Áo thun unisex cổ tròn tay ngắn Sportive Varsity Track"
                                        width={100} height={100}
                                        className='object-cover'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <h2 className='font-bold text-xl'>MLB</h2>
                                    <p className='text-[14px] mt-1'>Áo thun unisex cổ tròn tay ngắn Sportive Varsity Track</p>
                                    <p className='text-[14px] text-gray-500 mt-1'>43BKS / M / 3ATSV2143</p>
                                    <div className='flex justify-between mt-2'>
                                        <span className='text-[16px] font-bold'>1,690,000₫</span>
                                        <span className='text-[14px] font-bold'>Số lượng: <span className='font-bold'>1</span></span>
                                    </div>
                                </div>
                            </div>
                            <label className='text-[14px] font-medium font-sans uppercase'>Mã giảm giá</label>
                            <div className='flex pt-3'>
                                <input className='w-[288px] h-11 border border-black' type="text" placeholder='   Nhập Mã Giảm Giá' />
                                <button className='w-[110px] h-11 bg-black text-white'>Sửa Dụng</button>
                            </div>
                            <div className='flex gap-1 items-center pt-4 pb-2'>
                                <svg className='w-5 h-5' width="15" height="10" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3337 5.3335V2.00016C17.3337 1.07516 16.5837 0.333496 15.667 0.333496H2.33366C1.41699 0.333496 0.675326 1.07516 0.675326 2.00016V5.3335C1.59199 5.3335 2.33366 6.0835 2.33366 7.00016C2.33366 7.91683 1.59199 8.66683 0.666992 8.66683V12.0002C0.666992 12.9168 1.41699 13.6668 2.33366 13.6668H15.667C16.5837 13.6668 17.3337 12.9168 17.3337 12.0002V8.66683C16.417 8.66683 15.667 7.91683 15.667 7.00016C15.667 6.0835 16.417 5.3335 17.3337 5.3335ZM15.667 4.11683C14.6753 4.69183 14.0003 5.77516 14.0003 7.00016C14.0003 8.22516 14.6753 9.3085 15.667 9.8835V12.0002H2.33366V9.8835C3.32533 9.3085 4.00033 8.22516 4.00033 7.00016C4.00033 5.76683 3.33366 4.69183 2.34199 4.11683L2.33366 2.00016H15.667V4.11683ZM9.83366 9.50016H8.16699V11.1668H9.83366V9.50016ZM8.16699 6.16683H9.83366V7.8335H8.16699V6.16683ZM9.83366 2.8335H8.16699V4.50016H9.83366V2.8335Z" fill="#318DBB"></path>
                                </svg>
                                <p className='text-[12px] text-[#2E2E2E]'>Xem thêm mã giảm giá</p>

                            </div>
                            <div className='w-[71px] h-[27px] border border-black bg-[#F9E076] rounded-xl mb-4'>
                                <span className='text-[12px] font-bold flex justify-center py-[3px] '>Giảm 5%</span>
                            </div>
                            <hr className='pb-4' />
                            <div>
                                <h2 className='font-normal'>Khách hàng thân thiết</h2>
                            </div>
                            <div className='pb-4'>
                                <tr className='grid grid-cols-2 py-1'>
                                    <td className='text-[14px] font-bold'>Tạm Tính</td>
                                    <td className='flex justify-end text-[14px] font-bold'>1,690,000₫</td>
                                </tr>
                                <tr className='grid grid-cols-2 py-1'>
                                    <td className='text-[14px]'>Phí Vận Chuyển</td>
                                    <td className='flex justify-end'>+ — </td>
                                </tr>
                            </div>
                            <hr />
                            <div className='pt-4 pb-4'>
                                <tr className='grid grid-cols-2'>
                                    <td className='text-[20px] font-bold text-[#4b4b4b]'>Tổng Cộng</td>
                                    <td className='flex justify-end text-[20px] font-bold text-[#4b4b4b]'>1,690,000₫</td>
                                </tr>
                            </div>
                        </div>
                    </div>
                    {/* thông tin */}
                    <div className='px-4 pt-4 lg:px-0 lg:pt-0 lg:order-1'>
                        <div className=''>
                            <h2 className='text-[16px] font-bold tracking-[1px] uppercase'>Thông Tin Giao Hàng</h2>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <div className='w-20 h-20 bg-[#f7f8f9] rounded-full flex justify-center items-center'>
                                <h2 className='text-[36px] font-bold'>V</h2>
                            </div>
                            <div className='flex justify-between'>
                                <div className=''>
                                    <span className='font-bold text-[16px]'>V.Tú Lương</span>
                                    <br />
                                    <span>(luongvantu@gmail.com)</span>
                                </div>
                                <div className='flex justify-end pt-6 ml-12'>
                                    <label className='text-[14px] font-bold underline'>Đăng Xuất</label>
                                </div>
                            </div>
                        </div>

                        <div className='pt-4 lg:pt-0'>
                            <div className="bg-white ">
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            Chọn địa chỉ
                                        </label>
                                        <select className="w-full h-[44px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">
                                            <option value="70000, Vietnam">70000, Vietnam</option>
                                            <option value="Lương Văn Tú">Lương Văn Tú</option>
                                        </select>
                                    </div>
                                    <div className='lg:grid lg:grid-cols-2 lg:gap-10'>
                                        <div className='pb-2'>
                                            <label className="block text-gray-700 font-semibold mb-1">
                                                Họ và Tên
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full h-[44px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                placeholder="Nhập Họ và Tên"
                                            />
                                        </div>
                                        <div className='pt-2 lg:pt-0'>
                                            <label className="block text-gray-700 font-semibold mb-1">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full h-[44px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                placeholder="Nhập Số điện thoại"
                                            />
                                            <p className="text-red-500 text-sm mt-1">
                                                Số điện thoại không hợp lệ (độ dài từ 10 - 11 ký tự, không chứa ký tự đặc biệt và khoảng trắng)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 lg:grid lg:grid-cols-2 lg:gap-2">
                                        <label className="block text-gray-700 font-semibold">
                                            <input
                                                type="radio"
                                                className="mr-2"
                                            />
                                            Giao tận nơi
                                        </label>
                                        <label className="block text-gray-700 font-semibold">
                                            <input
                                                type="radio"
                                                className="mr-2"
                                            />
                                            Nhận tại cửa hàng
                                        </label>
                                    </div>
                                    <div className='lg:grid lg:grid-cols-2 lg:gap-10'>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1">
                                                Địa chỉ
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full h-[44px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                placeholder="Nhập Địa chỉ"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1">
                                                Tỉnh / Thành
                                            </label>
                                            <select className="w-full h-[44px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">
                                                <option value="">Chọn tỉnh / thành</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1">
                                                Quận / Huyện
                                            </label>
                                            <select className="w-full h-[44px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">
                                                <option value="">Chọn quận / huyện</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1">
                                                Phường / Xã
                                            </label>
                                            <select className="w-full h-[44px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">
                                                <option value="">Chọn phường / xã</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="block text-gray-700 font-bold">
                                            <input
                                                type="radio"
                                                className="mr-2"
                                            />
                                            Nhà
                                        </label>
                                        <label className="block text-gray-700 font-bold">
                                            <input
                                                type="radio"
                                                className="mr-2"
                                            />
                                            Công Ty
                                        </label>
                                    </div>
                                    <hr className='pt-4' />
                                    <div className="bg-white ">
                                        <h3 className="text-xl font-bold text-gray-800 tracking-[1px]">
                                            PHƯƠNG THỨC VẬN CHUYỂN
                                        </h3>

                                        <div className="w-[400px] lg:w-[800px] h-[190px] p-[21px]">
                                            <div className='flex justify-center'>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 64 64"
                                                    stroke="currentColor"
                                                    className="w-24 h-24 text-gray-400"
                                                >
                                                    <path
                                                        d="M12 22L32 32 52 22 32 12 12 22z"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M12 22v20l20 10 20-10V22"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M32 12v20"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M52 22L32 32v20M12 22l20 10v20"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-center ">
                                                Vui lòng chọn tỉnh / thành để có danh sách phương thức vận chuyển.
                                            </p>
                                        </div>
                                        <hr />
                                        <div className='pt-4'>
                                            <form>
                                                <h2 className='text-xl font-bold text-gray-800 tracking-[1px] uppercase'>Phương Thức Thanh Toán</h2>
                                                <div className='flex items-center gap-[10px] pb-2 h-[56px]'>
                                                    <input className='w-[18px] h-[18px]' type="radio" />
                                                    <div className='flex items-center gap-4'>
                                                        <img src="https://file.hstatic.net/1000284478/file/atm-01_3e4ba76cfbca40f0b523f803829ae9d2.svg" alt="" width={40} height={40} />
                                                        <label className='text-[14px] font-bold'>Thanh toán bằng ATM/Thẻ nội địa</label>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-[10px] pb-2 h-[56px]'>
                                                    <input className='w-[18px] h-[18px]' type="radio" />
                                                    <div className='flex items-center gap-4'>
                                                        <img src="https://file.hstatic.net/1000284478/file/payoo-01_e9e5e556edcb421ca976168c95b32dda.svg" alt="" width={40} height={40} />
                                                        <label className='text-[14px] font-bold'>Thanh toán qua ví Payoo</label>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-[10px] pb-2 h-[56px]'>
                                                    <input className='w-[18px] h-[18px]' type="radio" />
                                                    <div className='flex items-center gap-4'>
                                                        <img src="https://file.hstatic.net/1000284478/file/momo-45_eee48d6f0f9e41f1bd2c5f06ab4214a2.svg" alt="" width={40} height={40} />
                                                        <label className='text-[14px] font-bold'>Thanh toán qua ví MoMo</label>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-[10px] pb-2 h-[56px]'>
                                                    <input className='w-[18px] h-[18px]' type="radio" />
                                                    <div className='flex items-center gap-4'>
                                                        <img src="https://file.hstatic.net/1000284478/file/vnpay-40_5dbcecd2b4eb4245a4527d357a0459fc.svg" alt="" width={40} height={40} />
                                                        <label className='text-[14px] font-bold'>Thanh toán qua cổng VNPay</label>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-[10px] pb-2 h-[56px]'>
                                                    <input className='w-[18px] h-[18px]' type="radio" />
                                                    <div className='flex items-center gap-4'>
                                                        <img src="https://file.hstatic.net/1000284478/file/zalo_pay-39_a15d1d155b814bf38a06e52e1fff5cad.svg" alt="" width={40} height={40} />
                                                        <label className='text-[14px] font-bold'>Thanh toán qua ZaloPay x VietQR</label>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-[10px] pb-2 h-[56px]'>
                                                    <input className='w-[18px] h-[18px]' type="radio" />
                                                    <div className='flex items-center gap-4'>
                                                        <img src="https://file.hstatic.net/1000284478/file/cod_icon-47_a8768752c1a445da90d600ca0a94675c.svg" alt="" width={40} height={40} />
                                                        <label className='text-[14px] font-bold'>Thanh toán khi giao hàng (COD)</label>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='hidden lg:flex justify-center items-center lg:fixed bottom-0 w-full bg-gray-300 pt-8 pb-8'>
                <div className='lg:flex lg:justify-center lg:items-center lg:gap-5'>
                    <button className='bg-[#FFFFFF] h-[62px] text-[#2e2e2e] w-[330px] lg:flex lg:justify-center lg:items-center'>
                        <svg className='mr-[10px]' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <label className='text-[14px] uppercase font-bold'>Quay lại giỏ hàng</label>
                    </button>
                    <button className='bg-[#b2b2b2] h-[62px] text-white w-[330px] text-[14px] uppercase font-bold'>
                        Hoàn tất đơn hàng
                    </button>
                </div>
            </div>

        </>
    )
}

export default PayPage