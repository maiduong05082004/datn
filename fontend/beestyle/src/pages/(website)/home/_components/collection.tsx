import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AddProductCart from '../../_components/AddProductCart'
const Collection = () => {
    const [cartItem, setCartItem] = useState<any>()
    const [activeCart, setActiveCart] = useState<boolean>(false)

    const { data: collections, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            return axios.get(`http://127.0.0.1:8000/api/client/home/productcollection`)
        }
    })

    return (
        !isLoading &&
        <section>
            <div className="pt-[40px]">
                <div className="px-[15px] pc:px-[48px]">

                    <div className="mb-[20px] lg:flex lg:justify-between lg:items-center">
                        <h3 className='font-[600] text-[24px] lg:text-[32px]'>BỘ SƯU TẬP</h3>
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

                                    {collections?.data.data.map((item: any) => (
                                        <div className="w-[38.66%] shrink-0 relative">
                                            <div onClick={() => { setCartItem(item), setActiveCart(!activeCart) }} className="absolute top-[16px] right-[16px]">
                                                <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                                    <div className="w-[24px] h-[24px]">
                                                        <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={`/products/${item.id}`} className="">
                                                <picture className='group'>
                                                    <div className="group-hover:hidden pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${item?.variations[0].variation_album_images[0]})` }} ></div>
                                                    <div className="hidden group-hover:block pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${item?.variations[0].variation_album_images[1]})` }} ></div>
                                                </picture>
                                            </Link>
                                            <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                                                <Link to={`/products/${item.id}`}>
                                                    <h4 className='description2 mb-[5px] text-[14px] font-[600]'>{item.name}</h4>
                                                    <div className="text-[14px] font-[700]">
                                                        <span className=''>{new Intl.NumberFormat('vi-VN').format(item.price)} VND</span>
                                                    </div>
                                                </Link>
                                                <div className="flex gap-1 justify-start mt-[18px]">
                                                    {item.variations.map((value: any, index: any) => (
                                                        <React.Fragment key={index + 1}>
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
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddProductCart cartItem={cartItem} activeCart={activeCart} setActiveCart={setActiveCart} />
        </section>
    )
}

export default Collection