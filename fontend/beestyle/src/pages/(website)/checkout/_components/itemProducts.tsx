import React, { useEffect, useState } from 'react'
import Promotions from './promotions'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Props = {
    checkouts: any,
    selectedAddress: any,
    setPriceShip: any,
    priceShip: any
    promotionShip: any,
    setPromotionShip: any,
    setPromotionProduct: any,
    promotionProduct: any,

    setPromotionAdd: any,
    promotionAdd: any
}

const ItemProducts = ({promotionAdd, promotionShip, promotionProduct, checkouts, selectedAddress, priceShip, setPriceShip, setPromotionShip, setPromotionProduct, setPromotionAdd}: Props) => {
    const [todos, setTodos] = useState<boolean>(true)
    const [isPromotion, setPromotion] = useState<boolean>(false)   
    const [checkShip, setCheckShip] = useState<any>({})

    useEffect(() => {
        if (promotionAdd && promotionAdd.length > 0) {
            promotionAdd.map((item: any) => {
                item.promotion_type === 'shipping' ?
                    setPromotionShip(item.discount_amount) :
                    setPromotionProduct(item.discount_amount)
            })
        } else {
            setPromotionShip(0)
            setPromotionProduct(0)
        }
    }, [promotionAdd])


    useEffect(() => {
        if (checkouts.products && checkouts.products.length > 0) {
            const data = {
                from_district_id: 3440,
                from_ward_code: "13007",
                service_id: 53321,
                to_district_id: parseInt(selectedAddress?.district),
                to_ward_code: selectedAddress?.ward,
                height: 40,
                length: 1,
                weight: 70,
                width: 40,
                insurance_value: checkouts?.totalPrice,
                cod_failed_amount: checkouts?.totalPrice,
                coupon: null,
                items: checkouts.products.map((item: any) => ({
                    quantity: item.quantity,
                    name: item.product.name,
                    height: 200,
                    weight: 1000,
                    length: 200,
                    width: 100,
                }))
            }
            if (data) {
                setCheckShip(data);
            }
        }
    }, [checkouts, selectedAddress])

    const { data: shipData } = useQuery({
        queryKey: ['shipData', checkShip],
        queryFn: async () => {
            if (!checkShip) return;
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`, {
                params: checkShip,
                headers: {
                    'token': `4bd9602e-9ad5-11ef-8e53-0a00184fe694`,
                },
            });
        },
        enabled: !!checkShip,
    })

    useEffect(() => {
        if (shipData) {
            setPriceShip(shipData?.data?.data.total);
        }
    }, [shipData])

    return (
        <div className="mb-[16px] lg:w-[35%] lg:order-2">
            <button className='flex items-center justify-between w-full lg:mb-[16px]'>
                <div onClick={() => { setTodos(!todos) }} className="flex items-center">
                    <span className="text-[16px] font-[700]">TÓM TẮT ĐƠN HÀNG</span>
                    <svg className={`${todos ? "hidden" : ""} ml-[4px]`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#2E2E2E" strokeLinecap="round" strokeLinejoin="round"></path> </svg>
                    <svg className={`${todos ? "" : "hidden"} ml-[4px]`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)">
                        <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#2E2E2E" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>

                </div>
                <span className="text-[20px] font-[700]">{new Intl.NumberFormat('vi-VN').format(checkouts?.totalPrice) || 0} VND</span>
            </button>
            <div className="bg-[#f7f7f7] -mx-[16px] lg:mx-0">
                <div className="w-[100%] p-[16px]">
                    <div className={`${todos ? "hidden" : ""}`}>
                        {checkouts?.products.map((item: any, index: any) => (
                            <div key={index + 1} className="mb-[16px]">
                                <div className='w-[100%] flex justify-between'>
                                    {
                                        item.product.variations.map((value: any, index: any) => (
                                            <div key={index + 1} className={`${value.id === item.variation_id ? "" : "hidden"} w-[100px] h-[100px]`}>
                                                <div className="pt-[100%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${value.variation_album_images[0]})`, }}></div>
                                            </div>
                                        ))
                                    }

                                    <div className="w-full pl-[12px] flex flex-col">
                                        <div className="leading-5">
                                            <b className='text-[16px]'>MLB</b><br />
                                            <span className='text-[14px] mb-[4px]'>{item.product.name}</span>
                                        </div>
                                        <span className='text-[12px] mb-[4px]'>50CRS / {item.variation_values.value} / {item.variation_values.sku}</span>
                                        <div className="text-[14px] *:font-[700] flex justify-between mt-[8px]">
                                            <span className=''>{new Intl.NumberFormat('vi-VN').format(item.variation_values.price)}<span>VND</span></span>
                                            <span className=''>Số lượng: {item.quantity}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pb-[16px]">
                        <div className="flex justify-between">
                            <div className="w-[100%]">
                                <span className='mb-[8px] text-[12px] font-[600] text-[#808080] tracking-widest'>MÃ GIẢM GIÁ</span>
                                <div className="mt-[8px] flex justify-between w-[100%] border-[1px] border-[#808080] leading-3 rounded-[3.5px]">
                                    <input className='outline-none rounded-[3.5px] text-[12px] w-[calc(100%-100px)] p-[13px]' type="text" placeholder='Nhap Ma Giam Gia' />
                                    <button className='rounded-r-[3.5px] text-[12px] font-[700] justify-center tracking-widest bg-black text-white items-center px-[20px] w-[124.47px] flex'>SỬ DỤNG</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-[8px] pb-[16px] mb-[16px] flex flex-col">
                        <div onClick={() => setPromotion(!isPromotion)} className="flex cursor-pointer justify-start items-center mb-[8px]">
                            <svg className='mr-[8px]' width="21" height="18" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="none" d="M17.3337 5.3335V2.00016C17.3337 1.07516 16.5837 0.333496 15.667 0.333496H2.33366C1.41699 0.333496 0.675326 1.07516 0.675326 2.00016V5.3335C1.59199 5.3335 2.33366 6.0835 2.33366 7.00016C2.33366 7.91683 1.59199 8.66683 0.666992 8.66683V12.0002C0.666992 12.9168 1.41699 13.6668 2.33366 13.6668H15.667C16.5837 13.6668 17.3337 12.9168 17.3337 12.0002V8.66683C16.417 8.66683 15.667 7.91683 15.667 7.00016C15.667 6.0835 16.417 5.3335 17.3337 5.3335ZM15.667 4.11683C14.6753 4.69183 14.0003 5.77516 14.0003 7.00016C14.0003 8.22516 14.6753 9.3085 15.667 9.8835V12.0002H2.33366V9.8835C3.32533 9.3085 4.00033 8.22516 4.00033 7.00016C4.00033 5.76683 3.33366 4.69183 2.34199 4.11683L2.33366 2.00016H15.667V4.11683ZM9.83366 9.50016H8.16699V11.1668H9.83366V9.50016ZM8.16699 6.16683H9.83366V7.8335H8.16699V6.16683ZM9.83366 2.8335H8.16699V4.50016H9.83366V2.8335Z" fill="#2E2E2E"></path>
                            </svg>
                            <span>Xem thêm mã giảm giá</span>
                        </div>
                    </div>


                    <div className="">
                        <div className="*:text-[14px] mb-[20px]">
                            <div className="flex justify-between *:font-[700]">
                                <h3>Tạm tính</h3>
                                <span>{new Intl.NumberFormat('vi-VN').format(checkouts?.totalPrice) || 0} VND</span>
                            </div>
                            <div className="flex justify-between mt-[3px]">
                                <div className="flex items-center">
                                    <span className='mr-[13px]'>Phí vận chuyển</span>
                                </div>


                                <span className='text-[14px]'>
                                   + {new Intl.NumberFormat('vi-VN').format(priceShip ? priceShip : 0)} VND
                                </span>
                            </div>


                            {promotionAdd && promotionAdd.map((item: any) => (
                                item.promotion_type !== 'shipping' ? (
                                    <div key={item.id} className="flex justify-between mt-[3px]">
                                        <div className='flex items-center'>
                                            <span className='mr-[13px]'>Giảm giá</span>
                                            <span className='flex items-end'>
                                                <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg" fill="#CE4549"><path d="M14.476 0H8.76c-.404 0-.792.15-1.078.42L.446 7.207c-.595.558-.595 1.463 0 2.022l5.703 5.35c.296.28.687.42 1.076.42.39 0 .78-.14 1.077-.418l7.25-6.79c.286-.268.447-.632.447-1.01V1.43C16 .64 15.318 0 14.476 0zm-2.62 5.77c-.944 0-1.713-.777-1.713-1.732 0-.954.77-1.73 1.714-1.73.945 0 1.714.776 1.714 1.73 0 .955-.768 1.73-1.713 1.73z"></path></svg>
                                                <span className='ml-[5px] text-red-400 text-[12px]'>{item.code}</span>
                                            </span>
                                        </div>
                                        <span>- {new Intl.NumberFormat('vi-VN').format(item.discount_amount) || 0} VND</span>
                                    </div>
                                ) : (
                                    <div key={item.id} className="flex justify-between mt-[3px]">
                                        <div className="flex items-center">
                                            <span className='mr-[13px]'>Giảm giá phí vận chuyển</span>
                                            <span className='flex items-end'>
                                                <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg" fill="#CE4549"><path d="M14.476 0H8.76c-.404 0-.792.15-1.078.42L.446 7.207c-.595.558-.595 1.463 0 2.022l5.703 5.35c.296.28.687.42 1.076.42.39 0 .78-.14 1.077-.418l7.25-6.79c.286-.268.447-.632.447-1.01V1.43C16 .64 15.318 0 14.476 0zm-2.62 5.77c-.944 0-1.713-.777-1.713-1.732 0-.954.77-1.73 1.714-1.73.945 0 1.714.776 1.714 1.73 0 .955-.768 1.73-1.713 1.73z"></path></svg>
                                                <span className='ml-[5px] text-red-400 text-[12px]'>{item.code}</span>
                                            </span>
                                        </div>


                                        <span>- {new Intl.NumberFormat('vi-VN').format(item.discount_amount) || 0} VND</span>

                                    </div>
                                )
                            ))}



                        </div>

                        <div className="flex justify-between *:font-[700] text-[18px]">
                            <h2>TỔNG CỘNG</h2>
                            <span>{new Intl.NumberFormat('vi-VN').format(checkouts?.totalPrice + priceShip - promotionShip - promotionProduct) || 0} VND</span>
                        </div>
                    </div>
                </div>
            </div>
            <Promotions isPromotion={isPromotion} setPromotion={setPromotion} setPromotionAdd={setPromotionAdd} />
        </div>
    )
}

export default ItemProducts