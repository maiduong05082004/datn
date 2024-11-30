import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingPage from '../../loading/loadPage';
import AddProductCart from '../../_components/AddProductCart';

type Props = {}

const ProductNew = () => {

    const [categoryId, setCategoryId] = useState<any>({})
    const [cartItem, setCartItem] = useState<any>()
    const [activeCart, setActiveCart] = useState<boolean>(false)

    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: newpr, isLoading } = useQuery({
        queryKey: ["newpr"],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/home/productnew`)
        }
    })

    useEffect(() => {
        if (newpr?.data?.data) {
            const foundCategory = newpr.data.data.find((item: any) => item);
            if (foundCategory) {
                setCategoryId(foundCategory);
            }
        }
    }, [newpr?.data?.data]);

    if (isLoading) return <LoadingPage />

    return (
        !isLoading &&
        <section>
            <div className="pt-[40px]">
                <div className="px-[15px] pc:px-[48px]">
                    <div className="mb-[20px] lg:mb-[24px] lg:flex lg:justify-between lg:items-center">
                        <h3 className='font-[600] text-[24px] lg:text-[32px]'>HÀNG MỚI VỀ</h3>
                        <div className="flex gap-2.5 justify-start mt-[10px] font-[600] *:rounded-[25px] *:border-black *:border-[1px] *:py-[5px] *:leading-8 *:px-[15px] lg:mt-[0] *:lg:py-[0]">
                            {newpr?.data?.data.slice(0, 4).map((item: any) => (
                                <div onClick={() => setCategoryId(item)} className={`${item.name === categoryId.name ? "bg-black text-white" : "bg-white text-black"} cursor-pointer select-none`} >{item.name}</div>
                            ))}
                        </div>
                    </div>


                    {newpr?.data.data.map((item: any, index: any) => (
                        <div key={index + 1}
                            className={`${item.name === categoryId.name ? "" : "hidden"} -mx-[15px] overflow-x-auto whitespace-nowrap flex scrollbar lg:mx-[0]`}>
                            <div className="w-[100%] shrink-0 lg:grid lg:grid-cols-12">
                                <Link
                                    to={`/categories/${item.category_id}`}
                                    className="lg:col-span-7 relative group cursor-pointer">
                                    <picture className=''>
                                        <div className="pt-[101%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${item.image_path})` }}></div>
                                    </picture>
                                    <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                                        <div className="text-white font-[700] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-[15px_35px] border-[1px] rounded-[5px]">
                                            Xem tất cả
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center p-[15px] bg-white lg:col-span-5 lg:bg-[#F3F3F3] lg:p-[32px]">
                                    <div className="hidden lg:flex overflow-x-auto whitespace-nowrap scrollbar flex-col gap-4">
                                        <div className="flex gap-4">
                                            {item.products.slice(0, 3).map((product: any) => (
                                                <Link to={`/products/${product.id}`}
                                                    key={product.id}
                                                    className="max-w-[47%] grow-0 basis-[47%] shrink-0 relative"
                                                >
                                                    <div onClick={() => { setCartItem(product), setActiveCart(!activeCart) }} className="absolute cursor-pointer top-[16px] right-[16px]">
                                                        <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                                            <div className="w-[24px] h-[24px]">
                                                                <img
                                                                    src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg"
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <picture className='group'>
                                                            <div className="group-hover:hidden pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[0]})` }} ></div>
                                                            <div className="hidden group-hover:block pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[1]})` }} ></div>
                                                        </picture>
                                                    </div>
                                                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                                                        <h4 className="description mb-[30px] text-[14px] font-[600]">
                                                            {product.name}
                                                        </h4>
                                                        <div className="flex gap-1 justify-start">
                                                            <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                                                            <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            {item.products.slice(1, 6).map((product: any) => (
                                                <Link to={`/products/${product.id}`}
                                                    key={product.id}
                                                    className="max-w-[47%] grow-0 basis-[47%] shrink-0 relative"
                                                >
                                                    <div onClick={() => { setCartItem(product), setActiveCart(!activeCart) }} className="absolute cursor-pointer top-[16px] right-[16px]">
                                                        <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                                            <div className="w-[24px] h-[24px]">
                                                                <img
                                                                    src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg"
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <picture className='group'>
                                                            <div className="group-hover:hidden pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[0]})` }} ></div>
                                                            <div className="hidden group-hover:block pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[1]})` }} ></div>
                                                        </picture>
                                                    </div>
                                                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                                                        <h4 className="description mb-[30px] text-[14px] font-[600]">
                                                            {product.name}
                                                        </h4>
                                                        <div className="flex gap-1 justify-start">
                                                            <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                                                            <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto whitespace-nowrap scrollbar flex flex-col gap-4 lg:hidden">
                                        <div className="flex gap-4">
                                            {item.products.map((product: any) => (
                                                <Link to={`/products/${product.id}`}
                                                    key={product.id}
                                                    className="max-w-[47%] grow-0 basis-[47%] shrink-0 relative"
                                                >
                                                    <div className="absolute top-[16px] right-[16px]">
                                                        <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                                            <div className="w-[24px] h-[24px]">
                                                                <img
                                                                    src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg"
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <picture className='group'>
                                                            <div className="group-hover:hidden pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[0]})` }} ></div>
                                                            <div className="hidden group-hover:block pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[1]})` }} ></div>
                                                        </picture>
                                                    </div>
                                                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                                                        <h4 className="description mb-[30px] text-[14px] font-[600]">
                                                            {product.name}
                                                        </h4>
                                                        <div className="flex gap-1 justify-start">
                                                            <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                                                            <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <AddProductCart cartItem={cartItem} activeCart={activeCart} setActiveCart={setActiveCart} />
        </section>
    )
}

export default ProductNew