import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Slider from 'react-slick'

type Props = {
    cartItem: any,
    activeCart: any,
    setActiveCart: any
}

const AddProductCart = ({ cartItem, activeCart, setActiveCart }: Props) => {
    const [messageApi, contextHolder] = message.useMessage()
    const [variationId, setVariationId] = useState<any>()
    const [variationValues, setVariationValues] = useState<any>()
    const [quantity, setQuantity] = useState<any>(1)
    const navigater = useNavigate()

    const token = localStorage.getItem("token")
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: async (cart: any) => {
            try {
                await axios.post(`http://127.0.0.1:8000/api/client/cart/add`, cart, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Truyền token vào header
                    },
                })
            } catch (error) {
                throw new Error("Add to cart Error!!")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: 'success',
                content: "Thêm vào gio hàng thành công"
            }),
                queryClient.invalidateQueries({
                    queryKey: ['carts'],
                })
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: error.message
            })
        },
    })

    useEffect(() => {
        if (quantity <= 0) return setQuantity(1)
    }, [quantity])

    useEffect(() => {
        if (cartItem) {
            setVariationId(cartItem.variations[0])
        }
    }, [cartItem])

    useEffect(() => {
        if (variationId) {
            setVariationValues(variationId?.variation_values[0])
        }
    }, [variationId])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,    // Hiển thị 1 hình mỗi lần
        slidesToScroll: 1,  // Vuốt 1 slide mỗi lần
        swipe: true,
        customPaging: () => (
            <div className="custom-dot">
            </div>
        ),
        appendDots: (dots: any) => (
            <div
                style={{
                    backgroundColor: "transparent",
                    position: "relative",
                    width: "100%",
                }}
            >
                <ul style={{ margin: "0px", position: "absolute", bottom: "30px", width: "100%" }}> {dots} </ul>
            </div>
        ),
    };

    const handleSubmitCart = async (id: any, indexItem: any) => {
        if (!variationValues) {
            messageApi.error("Vui lòng chọn size")
        } if (!variationId) {
            messageApi.error("Vui lòng chọn màu sắc")
        }
        if (id) {
            if (indexItem === 0) {
                mutate({ product_id: parseInt(id), product_variation_value_id: variationValues.id, quantity: quantity })
            } else if (indexItem === 1) {
                mutate({ product_id: parseInt(id), product_variation_value_id: variationValues.id, quantity: quantity })
                navigater(`/carts`)
            }
        }
    }
    return (
        <>
            {contextHolder}
            <div className={`${activeCart ? "" : "hidden"} step fixed z-10 flex-col top-0`}>
                <div className="">
                    <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 flex top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] max-w-[825px] w-[100%]">
                        <div onClick={() => setActiveCart(!activeCart)} className="absolute right-0 cursor-pointer p-[5px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="w-[38%] ">
                            {cartItem?.variations.map((item: any) => (
                                <div className={``}>
                                    {item?.id === variationId?.id && (
                                        <Slider {...settings}>
                                            {item.variation_album_images.map((value: any) => (
                                                <div>
                                                    <img className='bg-cover bg-center bg-no-repeat' alt='' src={value} />
                                                </div>
                                            ))}
                                        </Slider>
                                    )}
                                </div>
                            ))}


                        </div>
                        <div className="w-[62%] p-[24px]">
                            <h2 className='mb-[5px] text-[20px] font-[400]'>{cartItem?.name}</h2>
                            <div className="my-[20px] flex flex-wrap gap-1.5 justify-start">
                                {variationId && cartItem?.variations.map((item: any) => (
                                    <>
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            name="options1"
                                            id={item?.id}
                                            value="1"
                                            onClick={() => setVariationId(item)}


                                        />
                                        <label htmlFor={item?.id} className={`${item?.id === variationId?.id ? "border-black" : ""} border-[1px] w-[64px] cursor-pointer`}>
                                            <img alt="" src={item?.variation_album_images[0]} />
                                        </label>
                                    </>
                                ))}


                            </div>

                            <div className={``}>
                                {variationId && variationValues && cartItem?.variations.map((item: any) => (
                                    <div className={`${item?.id == variationId?.id ? "" : "hidden"} select-none flex flex-wrap *:text-[14px] *:justify-center *:items-center *:rounded-[18px] *:mr-[8px] *:px-[16px] *:py-[7.5px] *:cursor-pointer *:min-w-[65px] *:border-[#E8E8E8] *:border-[1px] *:border-solid *:font-[500]`}>
                                        {item?.variation_values.map((value: any) => (
                                            <>
                                                <input
                                                    className='hidden'
                                                    // type="radio"
                                                    name="options1"
                                                    onClick={() => setVariationValues(value)}
                                                    value="1"
                                                    id={value?.id}

                                                />

                                                {value.stock == 0 ? (
                                                    <label htmlFor={value?.id} className="flex pointer-events-none bg-[#F8F8F8] text-[#D0D0D0]">{value?.value}</label>
                                                ) : (
                                                    <label htmlFor={value?.id} className={`${value?.id === variationValues?.id ? "bg-black text-white" : "bg-white text-black"} flex`}>{value?.value}</label>
                                                )}

                                            </>
                                        ))}
                                    </div>
                                ))}
                            </div>


                            <div className="my-[24px]">
                                <div className="border-[#E8E8E8] border-[1px] border-solid h-[48px] w-full flex justify-between *:justify-center">
                                    <button onClick={() => { setQuantity(quantity - 1) }} className='flex items-center w-[48px]'>-</button>
                                    <input className='pointer-events-none bg-transparent outline-none border-none w-[calc(100%-96px)] flex text-center text-[14.5px] font-[500]' min={1} max={10} type="number" name="" id="" value={quantity} />
                                    <button onClick={() => { setQuantity(quantity + 1) }} className='flex items-center w-[48px]'>+</button>
                                </div>
                            </div>

                            <div className="flex justify-between *:font-[500] *:p-[12px] *:w-[49%] *:rounded-[3px]">
                                <button onClick={() => { cartItem && handleSubmitCart(cartItem.id, 0), setActiveCart(!activeCart) }} className='text-black bg-white border-[1px] border-black'>Thêm vào giỏ</button>
                                <button onClick={() => { cartItem && handleSubmitCart(cartItem.id, 1), setActiveCart(!activeCart) }} className='text-white  bg-black'>Mua ngay</button>
                            </div>



                        </div>
                    </div>
                </div>
                <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
            </div>
        </>
    )
}

export default AddProductCart