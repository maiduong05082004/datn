import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddProductCart from '../../_components/AddProductCart';
import EventsAudio from '../../events/eventsAudio';
import EventsCanvas from '../../events/eventsCanvas';
import EventsIconListProducts from '../../events/eventsIconListProducts';


type Props = {}

const ProductsList = ({ products }: any) => {

    const [cartItem, setCartItem] = useState<any>()
    const [activeCart, setActiveCart] = useState<boolean>(false)

    const handleShowView = (item: any) => {
        let showView = JSON.parse(localStorage.getItem("showView") || '[]');

        if (showView.some((product: any) => product.id === item.id)) {
            return;
        } else {
            showView.push(item);
        }
        localStorage.setItem("showView", JSON.stringify(showView));
    };

    const handleAddCart = (item: any) => {
        setCartItem(item);
    }

    useEffect(() => {
        if(products?.data.products) {
            const firstTwoProducts = products?.data.products.slice(0, 8);
            localStorage.setItem("suggest", JSON.stringify(firstTwoProducts));
        }
    }, [products])


    if (products?.data?.length === 0) return (
        <div className='w-[100%] flex items-center justify-center py-[130px]'>
            <div className="">
                <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="52" viewBox="0 0 62 52" fill="none"> <g clip-path="url(#icon-recently)"> <path opacity="0.05" d="M52.4481 14.5268L30.9814 23.5046L9.50586 14.5268L30.9814 5.53125L52.4481 14.5268Z" fill="black" fill-opacity="0.5" stroke="#231815" stroke-width="1.09333" stroke-linejoin="round"></path> <path d="M52.4668 15.2886C52.3691 15.2886 52.2624 15.2709 52.1735 15.2264L30.7068 6.23974C30.4313 6.12419 30.2535 5.86641 30.2357 5.56419C30.2179 5.27086 30.3779 4.98641 30.6446 4.85308L37.8179 1.05752C38.0135 0.950855 38.2535 0.941966 38.4579 1.02197L59.5246 9.45752C59.7913 9.56419 59.9779 9.81308 60.0046 10.0975C60.0313 10.382 59.8979 10.6575 59.6579 10.8175L52.8846 15.1642C52.7602 15.2442 52.6179 15.2886 52.4668 15.2886ZM32.7868 5.44863L52.3868 13.662L57.5779 10.3286L38.2179 2.57752L32.7868 5.44863Z" fill="#D0D0D0"></path> <path d="M9.507 15.2921C9.37367 15.2921 9.24923 15.2566 9.13367 15.1944L1.40034 10.8477C1.14256 10.7055 0.991447 10.421 1.00923 10.1277C1.027 9.83435 1.21367 9.57657 1.48923 9.46991L22.4759 0.945464C22.6714 0.865464 22.8937 0.874353 23.0892 0.963241L31.3026 4.8388C31.5781 4.97213 31.747 5.24769 31.7381 5.54991C31.7381 5.85213 31.5514 6.1188 31.267 6.24324L9.80923 15.2388C9.71145 15.2744 9.61367 15.301 9.51589 15.301L9.507 15.2921ZM3.54256 10.2966L9.56034 13.6832L29.0892 5.49657L22.7337 2.49213L3.54256 10.2966Z" fill="#D0D0D0"></path> <path d="M30.4316 23.0041C30.5028 22.9241 30.5916 22.853 30.6983 22.8086C30.5916 22.853 30.5028 22.9241 30.4316 23.0041Z" fill="#D0D0D0"></path> <path d="M52.8841 13.8839C52.8841 13.8839 52.8663 13.8839 52.8574 13.875C52.8752 13.8839 52.893 13.9017 52.9108 13.9106C52.9019 13.9106 52.9019 13.8928 52.8841 13.8839Z" fill="#D0D0D0"></path> <path d="M30.2617 23.3352C30.2884 23.2286 30.3328 23.1308 30.3951 23.0508C30.3328 23.1397 30.2884 23.2286 30.2617 23.3352Z" fill="#D0D0D0"></path> <path d="M52.1641 13.8229C52.2707 13.7784 52.3863 13.7695 52.5018 13.7695C52.3863 13.7695 52.2707 13.7695 52.1641 13.8229Z" fill="#D0D0D0"></path> <path d="M30.3945 23.0484C30.3945 23.0484 30.4212 23.0217 30.439 23.0039C30.4212 23.0217 30.4123 23.0306 30.3945 23.0484Z" fill="#D0D0D0"></path> <path d="M30.2441 23.3615C30.2441 23.3615 30.2441 23.3882 30.2441 23.406C30.2441 23.3882 30.2441 23.3615 30.253 23.3438C30.253 23.3526 30.2441 23.3615 30.2441 23.3704V23.3615Z" fill="#D0D0D0"></path> <path d="M52.5547 13.7695C52.6614 13.7784 52.7591 13.8229 52.8569 13.8762C52.7591 13.8229 52.6614 13.7784 52.5547 13.7695Z" fill="#D0D0D0"></path> <path d="M60.9377 21.1829L52.9821 13.9562C52.9821 13.9562 52.9377 13.9295 52.911 13.9118C52.8932 13.9029 52.8755 13.8851 52.8577 13.8762C52.7599 13.8229 52.6621 13.7784 52.5555 13.7695C52.5377 13.7695 52.5199 13.7695 52.5021 13.7695C52.3866 13.7695 52.271 13.7695 52.1643 13.8229L30.6977 22.8006C30.591 22.8451 30.5021 22.9162 30.431 22.9962C30.4132 23.014 30.4043 23.0229 30.3866 23.0406C30.3243 23.1206 30.2799 23.2184 30.2532 23.3251C30.2532 23.3429 30.2532 23.3695 30.2443 23.3873C30.2443 23.4229 30.2266 23.4584 30.2266 23.494V50.7206C30.2266 50.9784 30.3599 51.2273 30.5821 51.3695C30.7066 51.4495 30.8488 51.494 30.991 51.494C31.0977 51.494 31.2132 51.4673 31.311 51.4229L52.7777 41.4762C53.0443 41.3518 53.2221 41.0762 53.2221 40.7829V25.6095L60.7066 22.454C60.9466 22.3562 61.1243 22.134 61.1688 21.8762C61.2132 21.6184 61.1243 21.3518 60.9288 21.1829H60.9377ZM51.7021 40.294L31.7732 49.5295V25.3695L37.9243 31.5473C38.0755 31.6984 38.271 31.7695 38.4666 31.7695C38.5643 31.7695 38.671 31.7518 38.7599 31.7073L51.7021 26.2584V40.3029V40.294ZM53.231 23.9473L51.7021 24.5962L38.6443 30.0984L32.351 23.7784L51.7021 15.6806L52.3155 15.4229L53.2399 16.2584L59.0266 21.5118L53.2399 23.9473H53.231Z" fill="#D0D0D0"></path> <path d="M31.6035 23.0508C31.6657 23.1308 31.7102 23.2286 31.7369 23.3352C31.7102 23.2286 31.6657 23.1308 31.6035 23.0508Z" fill="#D0D0D0"></path> <path d="M31.293 22.8008C31.3996 22.8452 31.4885 22.9163 31.5596 22.9963C31.4885 22.9163 31.3996 22.8452 31.293 22.8008Z" fill="#D0D0D0"></path> <path d="M9.09698 13.8839C9.09698 13.8839 9.08809 13.9017 9.07031 13.9106C9.08809 13.9017 9.10587 13.8839 9.12365 13.875C9.11476 13.875 9.10587 13.875 9.09698 13.8839Z" fill="#D0D0D0"></path> <path d="M9.13281 13.8762C9.2217 13.8229 9.32837 13.7784 9.43503 13.7695C9.32837 13.7784 9.23059 13.8229 9.13281 13.8762Z" fill="#D0D0D0"></path> <path d="M31.5586 23.0039C31.5586 23.0039 31.5853 23.0306 31.603 23.0484C31.5941 23.0306 31.5764 23.0217 31.5586 23.0039Z" fill="#D0D0D0"></path> <path d="M31.2927 22.8006L9.81717 13.8229C9.7105 13.7784 9.59495 13.7695 9.48828 13.7695C9.60384 13.7695 9.7105 13.7695 9.81717 13.8229L31.2927 22.8006Z" fill="#D0D0D0"></path> <path d="M31.7452 23.3626C31.7452 23.3626 31.7363 23.3448 31.7363 23.3359C31.7363 23.3537 31.7363 23.3804 31.7452 23.3982C31.7452 23.3804 31.7452 23.3715 31.7452 23.3537V23.3626Z" fill="#D0D0D0"></path> <path d="M31.7456 23.3962C31.7456 23.3962 31.7456 23.3518 31.7367 23.334C31.71 23.2273 31.6656 23.1295 31.6033 23.0495C31.5944 23.0318 31.5767 23.0229 31.5589 23.0051C31.4878 22.9251 31.3989 22.854 31.2922 22.8095L9.81666 13.8229C9.71 13.7784 9.59444 13.7695 9.48777 13.7695C9.47 13.7695 9.45222 13.7695 9.43444 13.7695C9.32777 13.7784 9.23 13.8229 9.13222 13.8762C9.11444 13.8851 9.09666 13.9029 9.07889 13.9118C9.06111 13.9295 9.03444 13.9384 9.01666 13.9562L1.03444 21.1473C0.838885 21.3251 0.749996 21.5829 0.794441 21.8406C0.838885 22.0984 1.00777 22.3206 1.24777 22.4184L8.75888 25.5918V40.7829C8.75888 41.0851 8.92777 41.3518 9.20333 41.4762L30.6789 51.4229C30.7855 51.4673 30.8922 51.494 30.9989 51.494C31.1411 51.494 31.2833 51.4495 31.4078 51.3695C31.63 51.2273 31.7633 50.9873 31.7633 50.7206V23.5118C31.7633 23.5118 31.7544 23.4406 31.7456 23.4051V23.3962ZM2.95444 21.4851L8.75888 16.2495L9.67444 15.4229L29.6478 23.7784L23.3544 30.0984L10.2878 24.5784L8.75888 23.9295L2.95444 21.4762V21.4851ZM30.2344 49.5384L10.2878 40.3029V26.2495L23.2389 31.7162C23.3367 31.7606 23.4344 31.7784 23.5411 31.7784C23.7367 31.7784 23.9411 31.6984 24.0833 31.5562L30.2344 25.3784V49.5473V49.5384Z" fill="#D0D0D0"></path> </g> <defs> <clipPath id="icon-recently"> <rect width="60.4089" height="50.6133" fill="white" transform="translate(0.777344 0.890625)"></rect> </clipPath> </defs> </svg>
                </div>
                <span className='font-[500] text-[14px] text-[#BCBCBC] my-[24px]'>Hiện nhóm sản phẩm chưa cập nhật sản phẩm</span>
            </div>
        </div>)

    return (
        <>

            <div className="grid grid-cols-4 lg:grid-cols-12 lg:px-[15px] lg:gap-2 pc:px-[48px]">
                {products?.data?.products.map((item: any) => (
                    <div className="mb-[30px] col-span-2 relative lg:col-span-3 lg:mb-[40px]">
                        <div onClick={() => { handleAddCart(item), setActiveCart(!activeCart) }} className="absolute cursor-pointer top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>

                        <EventsIconListProducts />

                        <div className="absolute flex flex-col items-start m-[6px]">
                            <div className="bg-[#FF0000] rounded-[3px] text-white text-[12px] font-[500] p-[3px_5px]">{item?.variations[0]?.variation_values[0]?.discount} %</div>
                            <div className="leading-5 bg-white text-black text-[12px] font-[500] p-[3px_10px] mt-[5px]">Hết hàng</div>
                        </div>
                        <Link to={`/products/${item.id}`} onClick={() => handleShowView(item)} className="">
                            <picture className='group'>
                                <div className="group-hover:hidden pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${item?.variations[0].variation_album_images[0]})` }} ></div>
                                <div className="hidden group-hover:block pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${item?.variations[0].variation_album_images[1]})` }} ></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/${item.id}`} onClick={() => handleShowView(item)}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>{item.name}</h4>
                                </Link>

                                <div className={` text-[14px] font-[700]`}>

                                    <span className={``}>{new Intl.NumberFormat('vi-VN').format(item.price)} VND</span>

                                </div>

                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                {item.variations.map((value: any) => (
                                    <React.Fragment >
                                        <input
                                            className='hidden'
                                            // type="radio"
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

            <AddProductCart cartItem={cartItem} activeCart={activeCart} setActiveCart={setActiveCart} />
        </>
    )
}

export default ProductsList