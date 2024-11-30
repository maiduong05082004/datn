import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddProductCart from '../../_components/AddProductCart'
import { Link } from 'react-router-dom'

type Props = {}

const ProductHot = (props: Props) => {
  const [categoryId, setCategoryId] = useState<any>({})
  const [cartItem, setCartItem] = useState<any>()
  const [activeCart, setActiveCart] = useState<boolean>(false)

  const { data: hotpr } = useQuery({
    queryKey: ["hotpr"],
    queryFn: async () => {
      return await axios.get(`http://127.0.0.1:8000/api/client/home/productnewhot`)
    }
  })

  useEffect(() => {
    if (hotpr?.data?.data) {
      const foundCategory = hotpr.data.data.find((item: any) => item);
      if (foundCategory) {
        setCategoryId(foundCategory);
      }
    }
  }, [hotpr?.data?.data]);

  return (
    <section>
      <div className="pt-[40px]">
        <div className="px-[15px] pc:px-[48px]">
          <div className="mb-[20px] lg:flex lg:justify-between lg:mb-[24px]">
            <h3 className='text-[24px] font-[600] lg:text-[32px]'>HÀNG BÁN CHẠY</h3>
            <div className="flex justify-start mt-[10px]">
              <div className='flex text-[16px] font-[600] lg:text-[18px]'>
                {hotpr?.data.data.slice(0, 5).map((item: any, index: any) => (
                  <div onClick={() => setCategoryId(item)} key={index + 1} className={`${index === 0 ? "" : "ml-[20px]"} cursor-pointer`}>{item.name}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="-mx-[15px] lg:-mx-[0]">
            {hotpr?.data?.data.map((item: any, index: any) => (
              <div key={index + 1} className={`${item.category_id === categoryId.category_id ? "flex" : "hidden"} gap-2 overflow-x-auto whitespace-nowrap scrollbar lg:gap-4`}>
                {
                  item.products.slice(0, 12).map((product: any, index: any) => (
                    <Link to={`/products/${product.id}`} key={index + 1} className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                      <div onClick={() => { setCartItem(product), setActiveCart(!activeCart) }} className="absolute cursor-pointer top-[16px] right-[16px]">
                        <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                          <div className="w-[24px] h-[24px]">
                            <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-0 flex items-center justify-center">
                        <div className="text-white text-[18px] font-[700]">{index + 1}</div>
                      </div>
                      <div className="">
                        <picture className='group'>
                          <div className="group-hover:hidden pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[0]})` }} ></div>
                          <div className="hidden group-hover:block pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${product?.variations[0].variation_album_images[1]})` }} ></div>
                        </picture>
                      </div>
                      <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                        <div className="">
                          <h4 className='description2 mb-[5px] text-[14px] font-[600]'>{product.name}</h4>
                          <div className="text-[14px] font-[700]">
                            <span className=''>{new Intl.NumberFormat('vi-VN').format(product.price)} VND</span>
                          </div>
                        </div>
                        <div className="flex gap-1 justify-start mt-[18px]">
                          <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                          <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
      </div>
      <AddProductCart cartItem={cartItem} activeCart={activeCart} setActiveCart={setActiveCart} />
    </section>
  )
}

export default ProductHot