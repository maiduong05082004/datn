import React from 'react'

type Props = {}

const CartPage = (props: Props) => {
    return (
        <>
            <div className='lg:mx-[124.600px]'>
                {/* Cart Section */}
                <div className='flex items-center gap-2 px-[14px] py-5 lg:relative'>
                    <input className='w-5 h-5' type="checkbox" name="" id="" />
                    <span className='text-[14px] text-[#202846] font-normal'>Chọn Tất Cả</span>
                </div>
                <hr className=' lg:border-[1px] border-gray-200 lg:w-[868px]' />
                <div>
                    <div className='lg:flex'>
                        <div className='font-sans px-4 py-6 pb-8 lg:w-[868px]'>
                            <div className='lg:flex lg:justify-between lg:items-center'>
                                <div className='flex gap-4 pb-5 '>
                                    <div>
                                        <input className='absolute w-5 h-5' type="checkbox" />
                                        <img
                                            src="https://product.hstatic.net/200000642007/product/43bks_3atsv2143_1_5c2f075f77744e7c91c793ac923bc7ec_8dffdf7d799d4d6e98aec03b06492ae4_master.jpg"
                                            alt="MLB - Áo thun unisex cổ tròn tay ngắn Sportive Varsity Track"
                                            className='w-[190px] lg:w-[120px] h-[140px]'
                                        />
                                    </div>

                                    {/* Product Description */}
                                    <div className='flex-grow'>
                                        <a href="#" className='text-[#1a1a1a] hover:underline'>
                                            MLB - Áo thun unisex cổ tròn tay ngắn Sportive Varsity Track
                                        </a>
                                        <div className='text-sm text-gray-500'>43BKS / M / 3ATSV2143</div>
                                        <div className='text-sm text-gray-500 pb-3'>Số lượng: 1</div>
                                        <div className='font-bold text-lg'>1,690,000₫</div>
                                    </div>

                                    {/* Action Buttons */}
                                </div>
                                {/* button */}
                                <div>
                                    <div className='lg:my-2'>
                                        <a href="" className='w-full lg:w-[130px] h-[33px] border border-[#E8E8E8] flex justify-center items-center text-[14px] font-sans font-medium'>Thay đổi tùy chọn</a>
                                    </div>
                                    <div>
                                        <button className='lg:w-[130px] lg:h-[33.6px] border border-[#E8E8E8] lg:flex hidden justify-center items-center text-[14px] font-sans font-medium'>Xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* info */}
                        <hr className=' border-[3px] border-gray-200' />
                        <div className='font-sans mx-5 pt-5 lg:w-[372px] lg:border lg:rounded-xl'>
                            <div className='lg:px-5'>
                                <h2 className='font-bold text-lg mb-4'>THÔNG TIN ĐƠN HÀNG</h2>
                                <div className='flex justify-between'>
                                    <span className='pb-2'>Tạm tính</span>
                                    <span>1,690,000₫</span>
                                </div>
                                <div className='flex justify-between border-b border-gray-300 pb-2 mb-2'>
                                    <span>Phí vận chuyển</span>
                                    <span>-</span>
                                </div>
                                <div className='flex justify-between font-bold'>
                                    <span>Tổng đơn hàng</span>
                                    <span>1,690,000₫</span>
                                </div>

                            </div>
                            <button className='bg-black text-white font-bold w-full py-3 mt-4'>
                                THANH TOÁN
                            </button>
                        </div>

                    </div>
                    <div className='pb-12'>
                        <hr className=' lg:border-[1px] border-gray-200 lg:w-[868px] ' />
                    </div>
                    <div className='lg:flex lg:items-center lg:pl-[350px]'>
                        <button className='lg:w-[193px] h-[49px] border rounded'>Tiếp Tục Mua Hàng</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CartPage
