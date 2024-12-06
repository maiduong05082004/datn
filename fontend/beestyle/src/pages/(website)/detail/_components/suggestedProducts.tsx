import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AddProductCart from '../../_components/AddProductCart'

const SuggestedProducts = () => {

    const [cartItem,setCartItem] = useState<any>()
    const [activeCart, setActiveCart] = useState<boolean>(false)
    const [products] = useState<any>(JSON.parse(localStorage.getItem("showView") || '[]'))

    const handleAddCart = (item: any) => {
        setCartItem(item);
    }
    return (
        <div className="">
            <div className="mt-[48px]">
                <div className="px-[15px] pc:px-[48px]">
                    <h3 className='text-[18px] mb-[20px] font-[700]'>CÓ THỂ BẠN CŨNG THÍCH</h3>
                    <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar lg:gap-4">

                        <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                            <div className="absolute top-[16px] right-[16px]">
                                <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                    <div className="w-[24px] h-[24px]">
                                        <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                                <div className="text-white text-[18px] font-[700]">1</div>
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
                </div>
                {products.length > 0 &&
                    <div className="px-[15px] mt-[48px] pc:px-[48px]">
                        <h3 className='text-[18px] mb-[20px] font-[700]'>SẢN PHẨM ĐÃ XEM</h3>
                        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar lg:gap-4">
                            {products?.map((item: any, index: any) => (
                                <Link to={`/products/${item.id}`} key={index + 1} className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                                    <div onClick={() => { handleAddCart(item), setActiveCart(!activeCart) }} className="absolute top-[16px] right-[16px]">
                                        <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                            <div className="w-[24px] h-[24px]">
                                                <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                                        <div className="text-white text-[18px] font-[700]">{index + 1}</div>
                                    </div>
                                    <div className="">
                                        <picture>
                                            <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${item.variations[0].variation_album_images[0]})`, }}></div>
                                        </picture>
                                    </div>
                                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                                        <div className="">
                                            <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                                            <div className="text-[14px] font-[700]">
                                                <span className=''>{new Intl.NumberFormat('vi-VN').format(item?.price)} VND</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 justify-start mt-[18px]">
                                            {item.variations.map((value: any) => (
                                                <React.Fragment >
                                                    <input
                                                        className='hidden'
                                                        id={``}
                                                        name={`options-`}
                                                        value="1"
                                                    />
                                                    <label htmlFor={``} className="w-[12px] h-[12px] cursor-pointer">
                                                        <img className="w-[12px] h-[12px] rounded-[100%]" src={value.attribute_value_image_variant.image_path} alt="" />
                                                    </label>
                                                </React.Fragment>
                                            ))}

                                        </div>
                                    </div>
                                </Link>
                            ))}

                        </div>
                    </div>
                }
            </div>
            <AddProductCart cartItem={cartItem} activeCart={activeCart} setActiveCart={setActiveCart} />
        </div>
    )
}

export default SuggestedProducts