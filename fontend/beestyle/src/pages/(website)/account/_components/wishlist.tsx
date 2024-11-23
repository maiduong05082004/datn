import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react'
import LoadingPage from '../../loading/loadPage';

type Props = {}

const WishlistPage = (props: Props) => {

    const [messageApi, contextHodle] = message.useMessage()
    const queryClient = useQueryClient()

    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const token = localStorage.getItem('token');

    const { data: favorite, isLoading: isLoadingWishList } = useQuery({
        queryKey: ['favorite'],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Truyền token vào header
                },
            })
        }
    })

    console.log(favorite);


    const { mutate } = useMutation({
        mutationFn: async (productId: any) => {
            try {
                return await axios.delete(`http://127.0.0.1:8000/api/client/wishlist/remove/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Truyền token vào header
                    },
                })
            } catch (error) {
                throw new Error(`Xóa sản phẩm yêu thích không thành công`)
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: 'success',
                content: 'Xóa sản phẩm yêu thích thành công',
            });
            queryClient.invalidateQueries({
                queryKey: ['favorite']
            });
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: error.message,
            })
        }
    })

    const handleRemoveFromWishlist = (productId: number) => {
        mutate(productId)
    }
    if (isLoadingWishList) return (<LoadingPage />)

    return (
        <div>
            {contextHodle}
            <div className="">
                <div className="text-[16px] font-[700] lg:text-[20px] border-b-black lg:border-b-[3px] py-[10px] lg:mb-[16px]">
                    Có <span>{favorite?.data?.data?.length || 0}</span> sản phẩm trong danh sách yêu thích
                </div>
                {favorite?.data?.data?.length <= 0 ?
                    <div className="pt-[150px] pb-[70px] flex flex-col items-center text-center">

                        <svg className='mb-[24px]' xmlns="http://www.w3.org/2000/svg" width="51" height="49" viewBox="0 0 51 49" fill="none"> <g clip-path="url(#wishlist-1)"> <path opacity="0.05" d="M43.8448 10.7822C46.5115 17.7689 40.9648 24.4356 39.8715 25.5289L20.9648 44.4267L23.7382 47.2L42.636 28.3022C47.8537 23.0844 46.9471 13.8933 43.836 10.7822H43.8448Z" fill="black" stroke="#231815" strokeWidth="1.09333" strokeLinejoin="round"></path> <path d="M50.0222 1.25333L48.7689 0L3.78223 44.9778L5.03556 46.2311L50.0222 1.25333Z" fill="#D0D0D0"></path> <path fillRule="evenodd" clip-rule="evenodd" d="M42.8223 8.44416C37.4446 3.49305 29.1779 3.43972 23.7557 8.29305C18.1823 3.31527 9.62234 3.49305 4.28012 8.83527C-1.26655 14.3731 -1.26655 23.3508 4.28012 28.8886L13.329 37.9464L14.4846 36.7908L5.42678 27.7331C0.520117 22.8353 0.520117 14.8886 5.42678 9.99972C10.3246 5.10194 18.2712 5.10194 23.169 9.99972C23.489 10.3197 24.0046 10.3197 24.3246 9.99972C29.0801 5.24416 36.7246 5.11083 41.6579 9.60861L42.8134 8.45305L42.8223 8.44416ZM42.8935 10.8886L44.0579 9.72416C48.7601 15.2886 48.4846 23.6353 43.2401 28.8886C43.2046 28.9242 43.1601 28.9597 43.1157 28.9864L24.3246 47.7775C24.1735 47.9286 23.9601 48.0175 23.7468 48.0175C23.5335 48.0175 23.3201 47.9286 23.169 47.7775L14.5823 39.1908L15.7379 38.0353L23.7468 46.0442L42.0668 27.7242C42.0668 27.7242 42.1468 27.6531 42.1823 27.6264C46.689 23.0042 46.9201 15.7686 42.8846 10.8886H42.8935Z" fill="#D0D0D0"></path> </g> <defs> <clipPath id="wishlist-1"> <rect width="49.9111" height="48.0267" fill="white" transform="translate(0.111328)"></rect> </clipPath> </defs> </svg>
                        <span className='text-[#BCBCBC] text-[14px] font-[500]'>
                            Không có danh sách mong muốn được lưu trữ <br />
                            Duyệt các sản phẩm được đề xuất
                        </span>
                    </div>
                    :
                    <div className="">
                        <div className="-mx-[15px] p-[24px_20px] lg:mx-0">
                            {favorite?.data?.data.map((item: any, index: any) => (
                                <div className={`${index === 0 ? "mt-0" : "mt-[20px]"} flex justify-between items-center`}>
                                    <div className='w-[80%] flex'>
                                        <div className='w-[120px]'>
                                            <div
                                                className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                style={{
                                                    backgroundImage: `url(${item.product.variations[0].variation_album_images[0]})`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="w-[calc(100%-120px)] pl-[16px] flex flex-col">
                                            <h3 className='text-[15px] mb-[4px] font-[500]'>
                                                {item.product.name}
                                            </h3>
                                            <span className='mt-[14px] font-[700]'>{new Intl.NumberFormat('vi-VN').format(item.product.price) || 0} VND</span>
                                        </div>
                                    </div>
                                    <div onClick={() => handleRemoveFromWishlist(item.product.id)} className="hidden w-[20%] cursor-pointer text-center border border-[#E8E8E8] rounded-[3px] text-[14px] py-[6px] px-[8px] lg:block">Xóa khỏi mục yêu thích</div>
                                    <div onClick={() => handleRemoveFromWishlist(item.product.id)} className="lg:hidden">
                                        <button className='cursor-pointer'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M13.9998 6L5.99988 14" stroke="black" strokeLinecap="square" strokeLinejoin="round"></path>
                                                <path d="M6 6L13.9999 14" stroke="black" strokeLinecap="square" strokeLinejoin="round"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>

        </div >
    )
}

export default WishlistPage