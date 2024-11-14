import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useProductMutations } from '@/components/hooks/useProductMutations';
import NavigationButton from './_components/navigationButton';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import LoadingPage from '../loading/loadPage';

type Props = {

}

const CartPage = ({}: any) => {

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeCart, setActiveCart] = useState<boolean>(false)
    const [variationId, setVariationId] = useState<any>()
    const [variationIdDf, setVariationIdDf] = useState<any>()
    const [variationValues, setVariationValues] = useState<any>()
    const [variationValuesDf, setVariationValuesDf] = useState<any>()
    const [quantity, setQuantity] = useState<any>()
    const [cartItem, setCartItem] = useState<any>()
    const { contextHolder, updateProductMutation, deleteProductMutation } = useProductMutations();

    const token = localStorage.getItem("token")
    const { data: carts, isLoading: isLoadingCarts } = useQuery({
        queryKey: ['carts', token],
        queryFn: async () => {
            return await axios.get('http://127.0.0.1:8000/api/client/cart', {
                headers: {
                    Authorization: `Bearer ${token}`, // Truyền token vào header
                }
            });
        },
    })

    useEffect(() => {
        if (variationId !== variationIdDf) {
            const data = cartItem?.product?.variations?.find((item: any) => item?.id == variationId)

            const value = data.variation_values.find((item: any) => item?.stock > 0)
            setVariationValues(value)
        }
        else {
            setVariationValues(variationValuesDf)
        }
    }, [variationId])


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

    const isAllSelected =
        selectedProducts.length === (carts?.data?.cart_items?.length || 0) &&
        carts?.data?.cart_items?.length > 0;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (quantity <= 0) return setQuantity(1)
    }, [quantity])

    useEffect(() => {
        if (carts?.data?.cart_items) {
            const total = carts?.data?.cart_items
                .filter((item: any) => selectedProducts.includes(item?.cart_item_id))
                .reduce((sum: any, item: any) => sum + ((item.variation_values?.price) * item.quantity), 0);
            setTotalPrice(total);
        }
    }, [selectedProducts, carts?.data?.cart_items]);



    useEffect(() => {
        if (carts?.data?.cart_items) {
            const allProductIds = carts?.data?.cart_items
                ?.filter((item: any) => item.variation_values.stock >= item.quantity)
                .map((item: any) => item.cart_item_id);
            setSelectedProducts([...allProductIds]);

            // Tính tổng tiền của tất cả sản phẩm khi tự động tích
            const total = carts?.data?.cartData?.filter((item: any) => item.variation_values.stock >= item.quantity)?.products.reduce(
                (sum: any, item: any) => sum + (item.price * item.quantity),
                0
            );
            setTotalPrice(total);
        }
    }, [carts?.data?.cart_items]);


    const handleDelete = (productId: any) => {
        deleteProductMutation.mutate(
            { token, productId }
        )
    }

    const handleSubmitClick = useCallback((cartItem: any) => {
        setActiveCart(!activeCart)
        setCartItem(cartItem)
        setVariationId(cartItem?.variation_id)
        setVariationIdDf(cartItem?.variation_id)
        setVariationValues(cartItem?.variation_values)
        setVariationValuesDf(cartItem?.variation_values)
        setQuantity(cartItem?.quantity)
    }, []);

    const handleUpdateCart = () => {
        updateProductMutation.mutate(
            { token, cartId: cartItem.cart_item_id, product_id: cartItem.product.id, quantity, product_variation_value_id: variationValues.id }
        )
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allProductIds = carts?.data?.cart_items?.filter((item: any) => item.variation_values.stock >= item.quantity).map((item: any) => item.cart_item_id) || [];
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (cartItemId: any) => {
        if (selectedProducts.includes(cartItemId)) {
            setSelectedProducts(selectedProducts.filter((id: any) => id !== cartItemId));
        } else {
            setSelectedProducts([...selectedProducts, cartItemId]);
        }
    };

    const navigate = useNavigate();
    const handleProceedToCheckout = () => {
        const selectedItems = carts?.data?.cart_items.filter((item: any) =>
            selectedProducts.includes(item.cart_item_id)
        );
        navigate("/checkouts", { state: { products: selectedItems, totalPrice } });
    };

    // if (isLoadingCarts) return (<LoadingPage />)
    return (
        <main>
            {contextHolder}
            <div className="lg:max-w-[1270px] lg:mx-auto lg:px-[15px] lg:mt-[40px]">
                <div className="w-[100%] mb-[16px] hidden lg:flex">
                    <div className="*:text-[12px] *:font-[500] hidden lg:block">
                        <span className='text-[#787878]'>DANH MUC {'>'} </span>
                        <span className='text-[#787878]'>TRANG CHU {'>'} </span>
                        <span>QUAN AO</span>
                    </div>
                </div>

                <div className="lg:flex lg:flex-wrap lg:items-start ">
                    <div className="lg:w-[70%]">

                        <div className="px-[20px] py-[14px] mb-[24px] flex items-center border-t-[1px] border-b-[1px] border-t-[#E8E8E8] border-b[#E8E8E8] mt-[2px] lg:border-t-0">
                            <input className='mr-[8px] w-[20px] h-[20px]'
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={isAllSelected}
                            />
                            <span className='text-[14px] font-[600]'>Chọn tất cả</span>
                        </div>




                        {carts?.data?.cart_items.length !== 0 && carts ? (
                            <div className="px-[20px]">
                                {carts?.data?.cart_items.map((item: any, index: any) => (
                                    <div key={index + 1} className="flex flex-wrap items-center justify-between mt-[24px] lg:justify-between lg:flex-nowrap">
                                        <div className='flex items-start w-[100%]'>
                                            <div className="w-[120px] relative">
                                                <input className='absolute w-[20px] h-[20px]'
                                                    type="checkbox"
                                                    checked={item.variation_values.stock >= item.quantity && selectedProducts.includes(item?.cart_item_id)}
                                                    onChange={() => handleSelectProduct(item?.cart_item_id)}
                                                />

                                                <div className="pt-[123.5%] bg-cover bg-center bg-no-repeat"
                                                    style={{ backgroundImage: `url(${item.album_images[0]})` }}
                                                ></div>
                                                {item.variation_values.stock < item.quantity ? (
                                                    <div className="bg-black absolute z-10 w-[100%] h-[100%] top-0 bg-opacity-30 flex items-center justify-center text-white font-[600] text-[16px] select-none">
                                                        Hết hàng
                                                    </div>
                                                ) : ""}
                                            </div>

                                            <div className='w-[calc(100%-120px)]'>
                                                <div className="pl-[16px]">
                                                    <div className="leading-5">
                                                        <Link to={`/products/${item?.product?.id}`} className='text-black hover:underline text-[14px] font-[600] w-[100%]'>
                                                            {item.product.name}
                                                        </Link>
                                                    </div>
                                                    <div className='text-[12px] text-black font-[500] my-[4px]'> {item.variation_values.value} / {item.variation_values.sku} </div>
                                                    <div className='text-[12px] text-black font-[500]'>Số lượng: {item.quantity}</div>

                                                    {item.variation_values.discount === 0 ?
                                                        (<div className='mt-[24px] flex flex-col'>
                                                            <span className={` font-[700] text-[16px]`}>{new Intl.NumberFormat('vi-VN').format(item.variation_values.price)} VND</span>
                                                        </div>) : (<div className='mt-[24px] flex flex-col'>
                                                            <del className={` text-[#808080] font-[500] text-[14px]`}>{new Intl.NumberFormat('vi-VN').format(item.product.price)} VND</del>
                                                            <span className={`text-red-500 font-[700] text-[16px]`}>{new Intl.NumberFormat('vi-VN').format(item.variation_values.price)} VND</span>
                                                        </div>)}
                                                </div>
                                            </div>

                                            <div className="lg:hidden">
                                                <button onClick={() => handleDelete(item.cart_item_id)} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M13.9998 6L5.99988 14" stroke="black" strokeLinecap="square" strokeLinejoin="round"></path>
                                                        <path d="M6 6L13.9999 14" stroke="black" strokeLinecap="square" strokeLinejoin="round"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center mt-[20px] w-[100%] lg:w-[156.5px] lg:flex-wrap *:font-[500] lg:mt-0">
                                            <button onClick={() => handleSubmitClick(item)} className='w-[100%] text-center border border-[#E8E8E8] rounded-[3px] text-[14px] py-[6px] px-[8px]'>Thay đổi tùy chọn</button>
                                            <button onClick={() => handleDelete(item.cart_item_id)} className='hidden w-full text-center border border-[#E8E8E8] rounded-[3px] text-[14px] py-[6px] px-[8px] mt-[8px] lg:block'>Xóa</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="hidden lg:flex justify-center mt-[24px] pt-[48px] border-t-[1px] border-t-[#E8E8E8]">
                                    <NavigationButton />
                                </div>
                            </div>
                        ) : (
                            <div className="w-[100%] py-[60px] flex flex-col items-center">
                                <div className="icon-empty-cart">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"> <path d="M21.27 31.67C21.76 31.67 22.19 31.48 22.57 31.1C22.95 30.72 23.14 30.29 23.14 29.8C23.14 29.31 22.95 28.88 22.57 28.5C22.19 28.12 21.76 27.93 21.27 27.93C20.74 27.93 20.29 28.12 19.94 28.5C19.58 28.88 19.41 29.31 19.41 29.8C19.41 30.29 19.59 30.72 19.94 31.1C20.3 31.48 20.74 31.67 21.27 31.67ZM32.27 31.67C32.76 31.67 33.19 31.48 33.57 31.1C33.95 30.72 34.14 30.29 34.14 29.8C34.14 29.31 33.95 28.88 33.57 28.5C33.19 28.12 32.76 27.93 32.27 27.93C31.78 27.93 31.35 28.12 30.97 28.5C30.59 28.88 30.4 29.31 30.4 29.8C30.4 30.29 30.59 30.72 30.97 31.1C31.35 31.48 31.78 31.67 32.27 31.67ZM43.14 31.67C43.63 31.67 44.06 31.48 44.44 31.1C44.82 30.72 45.01 30.29 45.01 29.8C45.01 29.31 44.82 28.88 44.44 28.5C44.06 28.12 43.63 27.93 43.14 27.93C42.65 27.93 42.22 28.12 41.84 28.5C41.46 28.88 41.27 29.31 41.27 29.8C41.27 30.29 41.46 30.72 41.84 31.1C42.22 31.48 42.65 31.67 43.14 31.67ZM9 55.2V15.6C9 14.58 9.34 13.72 10.03 13.03C10.72 12.34 11.58 12 12.6 12H51.8C52.82 12 53.68 12.34 54.37 13.03C55.06 13.72 55.4 14.57 55.4 15.6V44.13C55.4 45.15 55.06 46.01 54.37 46.7C53.68 47.39 52.83 47.73 51.8 47.73H16.47L9 55.2ZM10.47 51.6L15.8 46.27H51.8C52.42 46.27 52.93 46.07 53.33 45.67C53.73 45.27 53.93 44.76 53.93 44.14V15.6C53.93 14.98 53.73 14.47 53.33 14.07C52.93 13.67 52.42 13.47 51.8 13.47H12.6C11.98 13.47 11.47 13.67 11.07 14.07C10.67 14.47 10.47 14.98 10.47 15.6V51.6Z" fill="#D0D0D0"></path> <path opacity="0.05" d="M51.8 42.2696H15.8L10.47 47.5996V51.5996L15.8 46.2696H51.8C52.42 46.2696 52.93 46.0696 53.33 45.6696C53.73 45.2696 53.93 44.7596 53.93 44.1396V40.1396C53.93 40.7596 53.73 41.2696 53.33 41.6696C52.93 42.0696 52.42 42.2696 51.8 42.2696Z" fill="black"></path> </svg>
                                </div>
                                <p className='my-[24px] text-[16px] font-[500]'>Không có sản phẩm nào trong giỏ hàng</p>
                                <NavigationButton />
                            </div>
                        )}
                    </div>

                    <div className='mt-[32px] lg:w-[30%] lg:pl-[32px] lg:mt-0 lg:sticky top-0'>
                        <div className='p-[20px] border-t-[8px] border-t-[#F8F8F8] border-b-[8px] border-b-[#F8F8F8] lg:border-[#E8E8E8] lg:border-[2px] lg:rounded-[8px_8px_0_0] lg:py-[20px] lg:px-[24px]'>
                            <h2 className='font-[700] text-[18px] mb-[20px]'>THÔNG TIN ĐƠN HÀNG</h2>
                            <div className='flex justify-between text-[14px] font-[500]'>
                                <span className=''>Tạm tính</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)} VND</span>
                            </div>
                            <div className='flex justify-between mt-[12px] text-[14px] font-[500]'>
                                <span>Phí vận chuyển</span>
                                <span>-</span>
                            </div>
                            <div className='flex justify-between pt-[16px] mt-[16px]  border-t-[2px] border-t-black *:text-[16px] *:font-[700]'>
                                <span>Tổng đơn hàng</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)} VND</span>

                            </div>

                        </div>

                        <button onClick={() => handleProceedToCheckout()} className={`${carts?.data?.cart_items.length === 0 || selectedProducts.length === 0 ? "pointer-events-none bg-[#787878]" : ""} select-none outline-none bg-black text-white text-[16px] font-[600] w-full fixed bottom-0 h-[56px] -tracking-wide lg:static lg:rounded-[0_0_8px_8px]`}>
                            THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>


            <div className={`${activeCart ? "" : "hidden"} step fixed z-20 flex-col top-0`}>
                <div className="">
                    <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 flex top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] max-w-[825px] w-[100%]">
                        <div onClick={() => setActiveCart(false)} className="absolute right-0 cursor-pointer p-[5px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="w-[38%] ">
                            {cartItem && carts?.data?.cart_items.map((item: any, index: any) => (
                                <div key={index + 1} className={`${item?.cart_item_id === cartItem?.cart_item_id ? "" : "hidden"}`}>
                                    <Slider {...settings}>
                                        {item.album_images.map((image: any, index: any) => (
                                            <div key={index + 1} >
                                                <img className='bg-cover bg-center bg-no-repeat' src={image} alt='' />
                                                {/* <div className='pt-[120%] bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url()` }}></div> */}
                                            </div>
                                        ))}
                                    </Slider>
                                </div>

                            ))}

                        </div>
                        <div className="w-[62%] p-[24px]">
                            <h2 className='mb-[5px] text-[20px] font-[400]'>{cartItem?.product?.name}</h2>
                            <div className="my-[20px] flex flex-wrap gap-1.5 justify-start">
                                {cartItem?.product?.variations.map((item: any) => (
                                    <>
                                        <input
                                            className='hidden'
                                            // type="radio"
                                            name="options1"
                                            id={item?.id}
                                            value="1"
                                            onClick={() => { setVariationId(item?.id) }}


                                        />
                                        <label htmlFor={item.id} className={`${item?.id === variationId ? "border-black" : ""} border-[1px] w-[64px] cursor-pointer`}>
                                            <img src={item?.variation_album_images[0]} alt="" />
                                        </label>
                                    </>
                                ))}


                            </div>

                            {cartItem?.product?.variations.map((item: any, index: any) => (
                                <div key={index} className={`${item?.id === variationId ? "flex" : "hidden"} `}>
                                    {item.variation_values.map((value: any, index: any) => (
                                        <div key={index + 1} className={`select-none flex flex-wrap *:text-[14px] *:justify-center *:items-center *:rounded-[18px] *:mr-[8px] *:px-[16px] *:py-[7.5px] *:cursor-pointer *:min-w-[65px] *:border-[#E8E8E8] *:border-[1px] *:border-solid *:font-[500]`}>
                                            <>
                                                <input
                                                    className='hidden'
                                                    // type="radio"
                                                    name="options1"
                                                    onClick={() => (setVariationValues(value))}
                                                    value="1"
                                                    id={value?.id}

                                                />

                                                {value.stock == 0 ? (
                                                    <label htmlFor={value?.id} className="flex pointer-events-none bg-[#F8F8F8] text-[#D0D0D0]">{value?.value}</label>
                                                ) : (
                                                    <label htmlFor={value?.id} className={`${value?.id === variationValues?.id ? "bg-black text-white" : "bg-white text-black"} flex`}>{value.value}</label>
                                                )}

                                            </>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div className="my-[24px]">
                                <div className="border-[#E8E8E8] border-[1px] border-solid h-[48px] w-full flex justify-between *:justify-center">
                                    <button onClick={() => { setQuantity(quantity - 1) }} className='flex items-center w-[48px]'>-</button>
                                    <input className='pointer-events-none bg-transparent outline-none border-none w-[calc(100%-96px)] flex text-center text-[14.5px] font-[500]' min={1} max={10} type="number" name="" id="" value={quantity} />
                                    <button onClick={() => { setQuantity(quantity + 1) }} className='flex items-center w-[48px]'>+</button>
                                </div>
                            </div>

                            <div className="flex justify-between *:font-[500] *:p-[12px] *:w-[49%] *:rounded-[3px]">
                                <button onClick={() => setActiveCart(!activeCart)} className='text-black bg-white border-[1px] border-black'>Hủy</button>
                                <button onClick={() => { handleUpdateCart(), setActiveCart(!activeCart) }} className='text-white  bg-black'>Cập nhật</button>
                            </div>



                        </div>
                    </div>
                </div>
                <div onClick={() => setActiveCart(false)} className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
            </div>
        </main>
    )
}

export default CartPage
