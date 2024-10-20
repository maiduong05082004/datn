import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from '../404/page';
import LoadingPage from '../loading/page';

type Props = {
    //   onClicks: () => void;
}
const DetailPage = () => {

    const [variatons, setVariatons] = useState<any>("")
    const [variationValues, setVariatonValues] = useState<any>("")
    console.log(variatons);

    const { id } = useParams();

    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/products/showDetail/${id}`);
        },
    })

    console.log(products?.data?.product);

    useEffect(() => {
        if (products?.data?.product.variations[0]) {
            setVariatons(products?.data?.product.variations[0])
        }
    }, [products])

    useEffect(() => {
        if (variatons) {
            const foundVariation = variatons.variation_values.find((item: any) => item.stock > 0)
            if (foundVariation) {
                setVariatonValues(foundVariation)
            } else {
                setVariatonValues('')
            }
            // setVariatonValues(foundVariation)
        }
    }, [variatons, products])

    // useEffect(() => {
    //     if (variatons) {
    //         const foundVariation = products?.data?.product.variations.find((item: any) => item.attribute_value_image_variant?.id === variatons?.attribute_value_image_variant?.id)
    //         if (foundVariation) {
    //             const foundVariationValue = foundVariation.variation_values.find((item: any) => item.stock > 0)
    //             if (foundVariationValue) {
    //                 setVariatonValues(foundVariationValue)
    //             } else {
    //                 setVariatonValues('')
    //             }
    //         }
    //     }
    // }, [variatons, products])

    if (isLoading) return (<LoadingPage />)
    if (isError) return (<>{error}</>)


    return (
        <>
            <main >
                <div className="lg:mt-[34px]">
                    <div className="pc:px-[48px] lg:flex lg:flex-wrap">
                        <div className="lg:w-[55%] lg:px-[5%] lg:mb-[30px] lg:flex lg:gap-4 lg:h-screen">
                            <div className="relative lg:w-[86%] lg:order-2">
                                <div className="">
                                    <div className="w-[100%] relative">

                                        <div className={``}>

                                            <div

                                                className={` pt-[124%] bg-cover bg-no-repeat bg-center`}
                                                style={{ backgroundImage: `url()` }}
                                            >
                                                <div className="absolute top-[50%] translate-y-[-50%] text-black flex w-[100%] justify-between">
                                                    <button
                                                        className="w-[40px] h-[40px] flex justify-center items-center"

                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="30"
                                                            height="30"
                                                            viewBox="0 0 24 46"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M22.5 43.8335L1.66666 23.0002L22.5 2.16683"
                                                                stroke="black"
                                                                strokeWidth="2"
                                                                strokeLinecap="square"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="w-[40px] h-[40px] flex justify-center items-center"

                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="30"
                                                            height="30"
                                                            viewBox="0 0 24 46"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M1.66675 2.1665L22.5001 22.9998L1.66675 43.8332"
                                                                stroke="black"
                                                                strokeWidth="2"
                                                                strokeLinecap="square"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                <div className="absolute bottom-[15px] left-[50%] translate-x-[-50%] lg:hidden">

                                    <button

                                        className={`w-[8px] h-[8px] rounded-[50%] border-[1px] mx-[3.5px] `}

                                    >
                                    </button>

                                </div>
                            </div>


                            <div

                                className={` hidden lg:w-[14%] lg:flex-col lg:overflow-auto lg:order-1 lg:gap-4 lg:pr-[8px] lg:h-[96%] scrollbar`}
                            >

                                <div

                                    className={`pt-[120%] bg-cover bg-no-repeat bg-center cursor-pointer relative`} // Apply the custom border class
                                    style={{ backgroundImage: `url()` }}

                                ></div>

                            </div>

                        </div>


                        <div className="lg:w-[45%] lg:pl-[44px] lg:sticky lg:top-0 h-fit">
                            <div className="mt-[20px] lg:mt-0">

                                <div className="flex justify-between px-[20px] lg:px-0">

                                    <div className="">
                                        <h1 className='text-[18px] mb-[8px] font-[500] leading-6'>{products?.data?.product.name}</h1>


                                        <p className={` text-[12px] leading-3 font-[500]`}>
                                            Mã sản phẩm: <span> 11111</span>
                                        </p>

                                    </div>

                                    <div className="flex">
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"> <path d="M21.6969 8.01054C22.1594 8.80179 23.018 9.33333 24.0006 9.33333C25.4734 9.33333 26.6673 8.13943 26.6673 6.66667C26.6673 5.19391 25.4734 4 24.0006 4C22.5279 4 21.334 5.19391 21.334 6.66667C21.334 7.15674 21.4662 7.61594 21.6969 8.01054ZM21.6969 8.01054L10.3044 14.6561M10.3044 14.6561C9.84187 13.8649 8.98334 13.3333 8.00065 13.3333C6.52789 13.3333 5.33398 14.5272 5.33398 16C5.33398 17.4728 6.52789 18.6667 8.00065 18.6667C8.98334 18.6667 9.84187 18.1351 10.3044 17.3439M10.3044 14.6561C10.5351 15.0507 10.6673 15.5099 10.6673 16C10.6673 16.4901 10.5351 16.9493 10.3044 17.3439M10.3044 17.3439L21.6969 23.9895M21.6969 23.9895C22.1594 23.1982 23.018 22.6667 24.0006 22.6667C25.4734 22.6667 26.6673 23.8606 26.6673 25.3333C26.6673 26.8061 25.4734 28 24.0006 28C22.5279 28 21.334 26.8061 21.334 25.3333C21.334 24.8433 21.4662 24.3841 21.6969 23.9895Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>
                                        </button>
                                        {/* <Favorite /> */}
                                    </div>

                                </div>


                                <div className={` flex items-end px-[20px] my-[18px] lg:px-0`} >
                                    <span className="text-[20px] font-[500]">{new Intl.NumberFormat('vi-VN').format(variationValues?.price)} VND</span>
                                    <del className={` ml-[8px] text-[16px] text-[#808080]`}>{new Intl.NumberFormat('vi-VN').format(products?.data?.product?.price)} VND</del>
                                    <span className={` bg-[#FF0000] rounded-[3px] text-white text-[14px] font-[500] p-[2px_5px] ml-[5px]`}>-{variationValues?.discount}%</span>
                                </div>


                                <div className="flex justify-start gap-3 px-[20px] mb-[20px] lg:px-0">
                                    {products?.data?.product.variations.map((item: any) => (
                                        <>
                                            <input
                                                className='hidden'
                                                type="radio"
                                                id={item?.attribute_value_image_variant?.id}
                                                name="options"
                                                value="1"
                                                onChange={() => setVariatons(item)}
                                            />
                                            <label htmlFor={item?.attribute_value_image_variant?.id} className={`${item?.attribute_value_image_variant?.id == variatons?.attribute_value_image_variant?.id ? "border-black" : ""} relative w-[42px] h-[42px] rounded-[50%] border-[1px] border-solid flex justify-center text-center`}>
                                                <div className="w-[40px] h-[40px] rounded-[50%] border-[5px] border-solid border-white" style={{ backgroundImage: `url('${item?.attribute_value_image_variant?.image_path}')` }}></div>
                                            </label>
                                        </>

                                    ))}

                                </div>
                            </div>

                            <div className="px-[20px] lg:px-0">
                                <div className="flex justify-between mb-[25px]">
                                    <h4 className='text-[16px] font-[500]'>Chọn kích thước</h4>
                                    <span className='cursor-pointer flex items-center text-[14px] font-[500]'>
                                        <svg className='mr-[5px]' xmlns="http://www.w3.org/2000/svg" width="20" height="9" viewBox="0 0 20 9" fill="none"> <rect x="0.5" y="0.5" width="19" height="8" rx="0.5" stroke="black"></rect> <rect x="3.5" y="4" width="1" height="4" fill="black"></rect> <rect x="6.5" y="6" width="1" height="2" fill="black"></rect> <rect x="12.5" y="6" width="1" height="2" fill="black"></rect> <rect x="9.5" y="4" width="1" height="4" fill="black"></rect> <rect x="15.5" y="4" width="1" height="4" fill="black"></rect> </svg>
                                        Hướng dẫn kích thước
                                    </span>
                                </div>

                                <div className="">


                                    {products?.data?.product.variations.map((item: any) => (
                                        <div className={`${item?.attribute_value_image_variant?.id == variatons?.attribute_value_image_variant?.id ? "" : "hidden"} flex flex-wrap *:text-[14px] *:justify-center *:items-center *:rounded-[18px] *:mb-[8px] *:mr-[8px] *:px-[16px] *:py-[7.5px] *:cursor-pointer *:min-w-[65px] *:border-[#E8E8E8] *:border-[1px] *:border-solid *:font-[500]`}>

                                            {item.variation_values.map((value: any) => (
                                                <>
                                                    <input
                                                        className='hidden'
                                                        type="radio"
                                                        id={value?.sku}
                                                        name="options1"
                                                        value="1"
                                                        onChange={() => setVariatonValues(value)}
                                                    />

                                                    {value.stock < 0 ?
                                                        <label htmlFor={value.sku} className="flex pointer-events-none bg-[#F8F8F8] text-[#D0D0D0]">{value.value}</label> :
                                                        <label htmlFor={value.sku} className={`${value?.attribute_value_id === variationValues?.attribute_value_id ? "bg-black text-white" : "bg-white text-black"}  flex`}>{value.value}</label>
                                                    }
                                                </>
                                            ))}

                                        </div>

                                    ))}

                                </div>

                                <div className="my-[24px]">
                                    <div className="border-[#E8E8E8] border-[1px] border-solid h-[48px] w-full flex justify-between *:justify-center">
                                        <button className='flex items-center w-[48px]'>-</button>
                                        <input className='pointer-events-none bg-transparent outline-none border-none w-[calc(100%-96px)] flex text-center text-[14.5px] font-[500]' min={1} max={10} type="number" name="" id="" />
                                        <button className='flex items-center w-[48px]'>+</button>
                                    </div>
                                </div>

                                <div className="*:h-[56px] *:w-[50%] flex fixed bottom-0 w-[100%] left-0 z-10 lg:static">
                                    <button className='text-white bg-black'>THÊM VÀO GIỎ</button>
                                    <button className='text-white bg-[#b01722]'>MUA NGAY</button>
                                </div>

                                <div className="p-[12px] my-[10px] bg-[#fafafa] border-[1px] border-[dfdfdf] border-solid rounded-[4px]">
                                    <b className='font-[700] text-[15px] leading-7'>MLB Chào bạn mới</b>
                                    <br />
                                    <p className='font-[500] text-[14px] leading-7'>Nhận ngay ưu đãi 5% khi đăng ký thành viên và mua đơn hàng nguyên giá đầu tiên tại website*</p>
                                    <p className='font-[500] text-[14px] leading-7'>Nhập mã: MLBWELCOME</p>
                                    <p className='font-[500] text-[14px] leading-7'> Ưu đãi không áp dụng cùng với các CTKM khác</p>
                                </div>

                            </div>
                        </div>

                        <div className="lg:w-[55%] px-[15px] lg:px-0">
                            <div className="*:text-[14px] *:font-[600] *:py-[13px] *:px-[15px] overflow-x-auto whitespace-nowrap scrollbar flex ">
                                <div className="border-b-[3px] border-[black]">THÔNG TIN SẢN PHẨM</div>
                                <div className="">HƯỚNG DẪN BẢO QUẢN</div>
                                <div className="">TÌM TẠI CỬA HÀNG</div>
                                <div className="">CHÍNH SÁCH ĐỔI TRẢ</div>
                            </div>

                            <div className="lg:pt-[20px]">
                                <p>Varsity Soccer Jersey thuộc bộ sưu tập Varsity
                                    như bản tuyên ngôn cho phong cách thời trang cá
                                    tính, thời thượng. Nổi bật với kỹ thuật in độc
                                    đáo trên nền chất liệu đặc biệt với những đường
                                    kẻ sọc màu tương phản, Varsity Soccer Jersey sẵn
                                    sàng thay bạn khẳng định phong cách thời trang của
                                    mình.</p>
                                <p>
                                    Thương hiệu: MLB&nbsp;
                                    <br />
                                    Xuất xứ: Hàn Quốc&nbsp;
                                    <br />
                                    Giới tính: Unisex&nbsp;
                                    <br />
                                    Kiểu dáng: Áo thun
                                    <br />
                                    Màu sắc: Blue, Red, Silver
                                    <br />
                                    Chất liệu: 35% Cotton, 65% Polyester
                                    <br />
                                    Hoạ tiết: Trơn một màu
                                    <br />
                                    Thiết kế:
                                </p>
                                <ul>
                                    <li>Bo viền cổ áo với các đường kẻ sọc màu tương phản</li>
                                    <li>Thiết kế chữ số in lớn nổi bật ở mặt trước</li>
                                    <li>Chất vải cao cấp, thoáng mát và co giãn thoải mái</li>
                                    <li>Đường may tỉ mỉ, chắc chắn</li>
                                    <li>Màu sắc hiện đại, trẻ trung dễ dàng phối với nhiều trang phục và phụ kiện khác</li>
                                </ul>
                                <p>Logo: Chi tiết logo được in ở mặt sau áo<br />
                                    Phom áo: Over fit rộng thoải mái
                                    <br />
                                    Thích hợp mặc trong các dịp: Đi chơi, đi làm,....
                                    <br />
                                    Xu hướng theo mùa: Sử dụng được tất cả các mùa trong năm
                                </p>
                            </div>

                        </div>

                    </div>




                    <div className="">
                        <div className="mt-[48px]">
                            <div className="px-[15px] pc:px-[48px]">
                                <h3 className='text-[20px] mb-[20px] font-[700]'>Có thể bạn cũng thích</h3>
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

                            <div className="px-[15px] mt-[48px] pc:px-[48px]">
                                <h3 className='text-[20px] mb-[20px] font-[700]'>Sản phẩm đã xem</h3>
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
                        </div>



                    </div>
                </div>
                <div className={` fixed w-full h-full top-0 left-0 bg-black z-10 bg-opacity-[0.5] hidden justify-center items-center`}>
                    <div className="max-w-[900px] p-[16px] rounded-[7px] bg-white">
                        <div className="float-right cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <img className='' src="https://file.hstatic.net/1000284478/file/mlb_new_ao_unisex_-_desktop_9701027a890a4e1d885ae36d5ce8ece7.jpg" alt="" />
                    </div>
                </div>

            </main>

        </>
    )
}

export default DetailPage