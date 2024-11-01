import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const RecentlyPage = (props: Props) => {
    return (
        <div>
            <div className="flex justify-between py-[15px]  lg:border-b-[3px] lg:border-b-black lg:mb-[15px] lg:py-[10px]">
                <div className="text-[16px] font-[700] lg:text-[20px] ">Có 15 sản phẩm đã xem</div>
                <div className="text-[14px] font-[500] text-[#787878] underline">
                    <span>Chỉnh sửa</span>
                    <span className='ml-[10px]'>Xóa hết</span>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-1 lg:grid-cols-12 lg:gap-2">
                    <div className="mb-[30px] col-span-1 relative lg:col-span-3 lg:mb-[40px]">
                        <div className="absolute cursor-pointer top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute flex flex-col items-start m-[6px]">
                            <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">10 %</div>
                            <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                        </div>
                        <Link to={`/products`} className="">
                            <picture>
                                <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(https://picsum.photos/200/300)` }} ></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/`}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>hoa quả</h4>
                                </Link>

                                <div className={` text-[14px] font-[700]`}>

                                    <span className={``}>{new Intl.NumberFormat('vi-VN').format(1000)} VND</span>

                                </div>

                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                    <React.Fragment >
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            id={``}
                                            name={`options-`}
                                            value="1"

                                        />
                                        <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                            <img className="w-[12px] h-[12px] rounded-[100%]"  alt="" />
                                        </label>
                                    </React.Fragment>

                            </div>
                        </div>
                    </div> <div className="mb-[30px] col-span-1 relative lg:col-span-3 lg:mb-[40px]">
                        <div className="absolute cursor-pointer top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute flex flex-col items-start m-[6px]">
                            <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">10 %</div>
                            <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                        </div>
                        <Link to={`/products`} className="">
                            <picture>
                                <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(https://picsum.photos/200/300)` }} ></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/`}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>hoa quả</h4>
                                </Link>

                                <div className={` text-[14px] font-[700]`}>

                                    <span className={``}>{new Intl.NumberFormat('vi-VN').format(1000)} VND</span>

                                </div>

                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                    <React.Fragment >
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            id={``}
                                            name={`options-`}
                                            value="1"

                                        />
                                        <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                            <img className="w-[12px] h-[12px] rounded-[100%]"  alt="" />
                                        </label>
                                    </React.Fragment>

                            </div>
                        </div>
                    </div> <div className="mb-[30px] col-span-1 relative lg:col-span-3 lg:mb-[40px]">
                        <div className="absolute cursor-pointer top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute flex flex-col items-start m-[6px]">
                            <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">10 %</div>
                            <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                        </div>
                        <Link to={`/products`} className="">
                            <picture>
                                <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(https://picsum.photos/200/300)` }} ></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/`}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>hoa quả</h4>
                                </Link>

                                <div className={` text-[14px] font-[700]`}>

                                    <span className={``}>{new Intl.NumberFormat('vi-VN').format(1000)} VND</span>

                                </div>

                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                    <React.Fragment >
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            id={``}
                                            name={`options-`}
                                            value="1"

                                        />
                                        <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                            <img className="w-[12px] h-[12px] rounded-[100%]"  alt="" />
                                        </label>
                                    </React.Fragment>

                            </div>
                        </div>
                    </div> <div className="mb-[30px] col-span-1 relative lg:col-span-3 lg:mb-[40px]">
                        <div className="absolute cursor-pointer top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute flex flex-col items-start m-[6px]">
                            <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">10 %</div>
                            <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                        </div>
                        <Link to={`/products`} className="">
                            <picture>
                                <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(https://picsum.photos/200/300)` }} ></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/`}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>hoa quả</h4>
                                </Link>

                                <div className={` text-[14px] font-[700]`}>

                                    <span className={``}>{new Intl.NumberFormat('vi-VN').format(1000)} VND</span>

                                </div>

                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                    <React.Fragment >
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            id={``}
                                            name={`options-`}
                                            value="1"

                                        />
                                        <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                            <img className="w-[12px] h-[12px] rounded-[100%]"  alt="" />
                                        </label>
                                    </React.Fragment>

                            </div>
                        </div>
                    </div> <div className="mb-[30px] col-span-1 relative lg:col-span-3 lg:mb-[40px]">
                        <div className="absolute cursor-pointer top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute flex flex-col items-start m-[6px]">
                            <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">10 %</div>
                            <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                        </div>
                        <Link to={`/products`} className="">
                            <picture>
                                <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(https://picsum.photos/200/300)` }} ></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/`}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>hoa quả</h4>
                                </Link>

                                <div className={` text-[14px] font-[700]`}>

                                    <span className={``}>{new Intl.NumberFormat('vi-VN').format(1000)} VND</span>

                                </div>

                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                    <React.Fragment >
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            id={``}
                                            name={`options-`}
                                            value="1"

                                        />
                                        <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                            <img className="w-[12px] h-[12px] rounded-[100%]"  alt="" />
                                        </label>
                                    </React.Fragment>

                            </div>
                        </div>
                    </div> <div className="mb-[30px] col-span-1 relative lg:col-span-3 lg:mb-[40px]">
                        <div className="absolute cursor-pointer top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute flex flex-col items-start m-[6px]">
                            <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">10 %</div>
                            <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                        </div>
                        <Link to={`/products`} className="">
                            <picture>
                                <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(https://picsum.photos/200/300)` }} ></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/`}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>hoa quả</h4>
                                </Link>

                                <div className={` text-[14px] font-[700]`}>

                                    <span className={``}>{new Intl.NumberFormat('vi-VN').format(1000)} VND</span>

                                </div>

                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                    <React.Fragment >
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            id={``}
                                            name={`options-`}
                                            value="1"

                                        />
                                        <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                            <img className="w-[12px] h-[12px] rounded-[100%]"  alt="" />
                                        </label>
                                    </React.Fragment>

                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default RecentlyPage