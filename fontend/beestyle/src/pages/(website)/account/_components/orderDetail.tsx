import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const OrderDetail = (props: Props) => {

    const { oderId } = useParams()

    const { data } = useQuery({
        queryKey: ['orderDetail', oderId],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/products/showDetailOrder/${oderId}`)
        },
    })

    console.log(data);
    
    return (
        <div className="">
            <div className="py-[15px] *:font-[700]">
                <div className="">ORDER12334F_SDSF</div>
                <div className="">Hủy đơn hàng</div>
            </div>

            <div className="">
                <div className="">
                    <div className="border-t-[8px] border-[#F0F0F0] -mx-[15px] p-[15px] border-b-[1px] text-[18px] font-[700] lg:border-t-0 lg:border-b-black lg:border-b-[3px]">Thông tin sản phẩm đặt hàng</div>
                    <div className="grid gap-4 grid-cols-4 lg:gap-5 lg:grid-cols-12 py-[15px]">
                        <div className={`flex justify-between items-center col-span-4 lg:col-span-6`}>
                            <div className='flex'>
                                <div className='w-[120px]'>
                                    <div
                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(https://product.hstatic.net/200000642007/product/07sbs_3amtv0841_1_896d4f0b238845e1a4c563b770d6e50f_741d3adf3f4a433e9a7e6b63e56b174e_large.jpg)`,
                                        }}
                                    ></div>
                                </div>
                                <div className="w-[calc(100%-120px)] pl-[16px] flex flex-col">
                                    <h3 className='text-[15px] mb-[4px] font-[500] text-ellipsis line-clamp-2'>
                                        BeeStyle áo ngắn  BeeStyle áo ngắn grid-cols-4 grid-cols-4 BeeStyle áo ngắn  BeeStyle áo ngắn grid-cols-4 grid-cols-4BeeStyle áo ngắn  BeeStyle áo ngắn grid-cols-4 grid-cols-4
                                    </h3>
                                    <span className='text-[14px] font-[500]'>BeeStyle / L / DGDFF_SGSDG</span>
                                    <span className='text-[14px] font-[500]'>Số lượng: 2</span>
                                    <span className='mt-[14px] font-[700]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</span>
                                </div>
                            </div>
                        </div>
                        <div className={`flex justify-between items-center col-span-4 lg:col-span-6`}>
                            <div className='flex'>
                                <div className='w-[120px]'>
                                    <div
                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(https://product.hstatic.net/200000642007/product/07sbs_3amtv0841_1_896d4f0b238845e1a4c563b770d6e50f_741d3adf3f4a433e9a7e6b63e56b174e_large.jpg)`,
                                        }}
                                    ></div>
                                </div>
                                <div className="w-[calc(100%-120px)] pl-[16px] flex flex-col">
                                    <h3 className='text-[15px] mb-[4px] font-[500]'>
                                        BeeStyle áo ngắn  BeeStyle áo ngắn grid-cols-4 grid-cols-4
                                    </h3>
                                    <span className='mt-[14px] font-[700]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</span>
                                </div>
                            </div>
                        </div>
                        <div className={`flex justify-between items-center col-span-4 lg:col-span-6`}>
                            <div className='flex'>
                                <div className='w-[120px]'>
                                    <div
                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(https://product.hstatic.net/200000642007/product/07sbs_3amtv0841_1_896d4f0b238845e1a4c563b770d6e50f_741d3adf3f4a433e9a7e6b63e56b174e_large.jpg)`,
                                        }}
                                    ></div>
                                </div>
                                <div className="w-[calc(100%-120px)] pl-[16px] flex flex-col">
                                    <h3 className='text-[15px] mb-[4px] font-[500]'>
                                        BeeStyle áo ngắn  BeeStyle áo ngắn grid-cols-4 grid-cols-4
                                    </h3>
                                    <span className='mt-[14px] font-[700]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-6">
                        <div className="border-t-[8px] border-[#F0F0F0] -mx-[15px] p-[15px] border-b-[1px] text-[18px] font-[700] lg:border-t-0 lg:border-b-black lg:border-b-[3px]">Thành tiền</div>
                        <div className="flex justify-between py-[15px]">
                            <div className="*:text-[#787878] *:block *:text-[15px]">
                                <span>Giá sản phẩm</span>
                                <span className='mt-[10px]'>Phí giao hàng</span>
                                <span className='mt-[10px]'>Giảm giá giao hàng</span>
                                <span className='mt-[10px]'>Giảm giá sản phẩm</span>
                                <span className='mt-[10px]'>Tôngr tiền</span>
                            </div>
                            <div className="flex flex-col items-end *:font-[500] *:text-[15px]">
                                <div>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-6">
                        <div className="border-t-[8px] border-[#F0F0F0] -mx-[15px] p-[15px] border-b-[1px] text-[18px] font-[700] lg:border-t-0 lg:border-b-black lg:border-b-[3px]">Địa chỉ nhận hàng</div>
                        <div className="flex justify-between py-[15px]">
                            <div className="*:text-[#787878] *:block *:text-[15px]">
                                <span>Giá sản phẩm</span>
                                <span className='mt-[10px]'>Phí giao hàng</span>
                                <span className='mt-[10px]'>Giảm giá giao hàng</span>
                                <span className='mt-[10px]'>Giảm giá sản phẩm</span>
                                <span className='mt-[10px]'>Tôngr tiền</span>
                            </div>
                            <div className="flex flex-col items-end *:font-[500] *:text-[15px]">
                                <div>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(2000000) || 0} VND</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail