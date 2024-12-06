import { useOrderViewMutations } from '@/components/hooks/useOrderViewMutations';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import LoadingPage from '../../loading/loadPage';
import Reason from './reason';

interface TDanh {
    content: string
    stars: number
}

const ViewAccount = () => {

    const [isCommentEvaluate, setCommentEvaluate] = useState<boolean>(false)
    const [itemProduct, setItemProduct] = useState<any>()
    const [start, setStart] = useState(5);
    const [isStep, setStep] = useState<number>(1)
    const [bill_id, setBillId] = useState<any>(null)
    const [isReason, setReason] = useState<boolean>(false)
    const queryClient = useQueryClient();
    const { evaluateOrder, handleContext } = useOrderViewMutations()
    const { register, handleSubmit, setValue, reset } = useForm<TDanh>()
    const status = [{ id: 1, name: "Tất cả" }, { id: 2, name: "Đang chờ xử lý" }, { id: 3, name: "Đã xử lý" }, { id: 4, name: "Đang giao hàng" }, { id: 5, name: "Đã giao hàng" }, { id: 6, name: "Đã hủy" }]

    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Lấy tất cả oder theo id người dùng
    const { data: order, isLoading: isLoadingOrder } = useQuery({
        queryKey: ['order'],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Truyền token vào header
                },
            })
        }
    })

    // useEffect(() => {
    //     if (order) {
    //         queryClient.invalidateQueries({ queryKey: ['order'] });
    //     }
    // }, [order]);

    setValue("stars", start)
    const onSubmit = (data: any) => {
        if (itemProduct) {
            const { product_id, id: bill_detail_id } = itemProduct
            evaluateOrder.mutate({ ...data, product_id, bill_detail_id });
            setCommentEvaluate(!isCommentEvaluate)
            setStart(5)
            reset()
        }
    }

    if (isLoadingOrder) return (<LoadingPage />)

    return (
        <>
            <Reason bill_id={bill_id} isReason={isReason} setReason={setReason}/>
            {handleContext}
            <div className="flex flex-col">
                <div className="flex justify-between overflow-x-auto whitespace-nowrap cursor-pointer select-none *:p-[15px]">
                    {status.map((status: any) => (
                        <div onClick={() => setStep(status.id)} className={status.id === isStep ? "border-b-black border-b-[3px]" : ""}>{status.name}</div>
                    ))}
                </div>

                {isStep === 1 &&
                    <div className="">
                        {order?.data.bills.length > 0 ?
                            order?.data?.bills.map((item: any, index: any) => (
                                <div key={index + 1} className="">
                                    <div className="flex p-[10px] -mx-[15px] lg:m-0 border-t-[#dadada] border-t-[1px] border-b-[#dadada] border-b-[1px] justify-between items-center bg-slate-100 lg:p-[15px]">
                                        <div className="items-center lg:flex">
                                            <div className="mr-[12px] font-[700]">{item.code_orders}</div>
                                            <div className="text-[#787878] text-[14px] font-[500]">{item.order_date} - {item.order_time}</div>
                                        </div>
                                        <div className="flex items-center">
                                            {item?.status_bill === "pending" &&
                                                <div className="mr-[10px] font-[700]">Đang xử lý |</div>
                                            }
                                            {item?.status_bill === "processed" &&
                                                <div className="mr-[10px] font-[700]">Đã xử lý |</div>
                                            }
                                            {item?.status_bill === "shipped" &&
                                                <div className="mr-[10px] font-[700]">Đang giao hàng |</div>
                                            }
                                            {item?.status_bill === "delivered" &&
                                                <div className="mr-[10px] font-[700]">Đã giao hàng |</div>
                                            }
                                            {(item?.status_bill === "canceled" || item?.status_bill === "returned") &&
                                                <div className="mr-[10px] font-[700]">Đã hủy |</div>
                                            }
                                            <Link to={`orders/${item.id}`} className='text-[14px] text-[#787878] underline cursor-pointer'>Xem chi tiết</Link>
                                        </div>
                                    </div>

                                    <div className="-mx-[15px] p-[15px] lg:mx-0">
                                        {item?.bill_detail.map((value: any, index: any) => (
                                            <div key={index + 1} className={`${index == 0 ? "mt-[0]" : "mt-[15px]"}`}>
                                                <div className='w-[100%] flex'>
                                                    <div className='w-[120px]'>

                                                        <div
                                                            className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                            style={{
                                                                backgroundImage: `url(${value.variation_images[1]})`,
                                                            }}
                                                        ></div>

                                                    </div>
                                                    <div className="w-[calc(100%-120px)] pl-[16px] flex items-center">
                                                        <div className="w-[calc(100%-80px)] flex flex-col">
                                                            <h3 className='text-[15px] mb-[4px] font-[500]'>
                                                                {value.name}
                                                            </h3>
                                                            <span className='text-[14px] font-[500]'>BeeStyle / {value.attribute_value_size} / {value.sku}</span>
                                                            <span className='text-[14px] font-[500]'>Số lượng: {value.quantity}</span>
                                                            <span className='mt-[14px] font-[700]'>{new Intl.NumberFormat("ei-VN").format(value.don_gia)} VND</span>
                                                        </div>

                                                        {item.status_bill === "delivered" ? (
                                                            <div className="">
                                                                {value.status_comment === 0 ?
                                                                    <div
                                                                        onClick={() => {
                                                                            setCommentEvaluate(!isCommentEvaluate);
                                                                            setItemProduct(value);
                                                                        }}
                                                                        className="cursor-pointer rounded-[3px] text-center w-[80px] py-[4px] border-[1px] border-[#B01722] mb-[5px] text-[#B01722]">Đánh giá</div>
                                                                    : ""}
                                                                <Link to={`/products/${value.product_id}`} className="p-[14px] cursor-pointer bg-[#B01722] text-white text-center rounded-[3px] w-[80px] py-[5px]">
                                                                    Mua lại
                                                                </Link>
                                                            </div>
                                                        ) : ""}
                                                        {item.status_bill === "shipped" && index == 0 ? (
                                                            <div className="">
                                                                <div className=" cursor-pointer rounded-[3px] text-center w-[120px] py-[4px] bg-green-400 mb-[5px] text-white">Đã nhận hàng</div>
                                                            </div>
                                                        ) : ""}

                                                        {item.status_bill === "processed" && index == 0 ?
                                                            ""
                                                            : ""}
                                                    </div>
                                                </div>
                                                {item.status_bill === "pending" && index == item?.bill_detail.length - 1 ? (
                                                <div className='flex justify-end gap-4 mt-[20px] border-t-[1px] border-t-[#e8e8e8] pt-[20px]'>
                                                    <div className="cursor-pointer rounded-[3px] text-center p-[5px_10px] border-[1px] border-black mb-[5px] text-black">Thay đổi đại chỉ</div>
                                                    <div onClick={() => {setBillId(value.bill_id), setReason(true)}} className=" cursor-pointer rounded-[3px] text-center p-[5px_10px] border-[1px] border-black mb-[5px] text-black">Hủy đơn hàng</div>
                                                </div>
                                            ) : ""}
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            ))
                            :
                            (
                                <div className="w-[100%] py-[130px] flex flex-col items-center">
                                    <div className="icon-empty-cart">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"> <path d="M21.27 31.67C21.76 31.67 22.19 31.48 22.57 31.1C22.95 30.72 23.14 30.29 23.14 29.8C23.14 29.31 22.95 28.88 22.57 28.5C22.19 28.12 21.76 27.93 21.27 27.93C20.74 27.93 20.29 28.12 19.94 28.5C19.58 28.88 19.41 29.31 19.41 29.8C19.41 30.29 19.59 30.72 19.94 31.1C20.3 31.48 20.74 31.67 21.27 31.67ZM32.27 31.67C32.76 31.67 33.19 31.48 33.57 31.1C33.95 30.72 34.14 30.29 34.14 29.8C34.14 29.31 33.95 28.88 33.57 28.5C33.19 28.12 32.76 27.93 32.27 27.93C31.78 27.93 31.35 28.12 30.97 28.5C30.59 28.88 30.4 29.31 30.4 29.8C30.4 30.29 30.59 30.72 30.97 31.1C31.35 31.48 31.78 31.67 32.27 31.67ZM43.14 31.67C43.63 31.67 44.06 31.48 44.44 31.1C44.82 30.72 45.01 30.29 45.01 29.8C45.01 29.31 44.82 28.88 44.44 28.5C44.06 28.12 43.63 27.93 43.14 27.93C42.65 27.93 42.22 28.12 41.84 28.5C41.46 28.88 41.27 29.31 41.27 29.8C41.27 30.29 41.46 30.72 41.84 31.1C42.22 31.48 42.65 31.67 43.14 31.67ZM9 55.2V15.6C9 14.58 9.34 13.72 10.03 13.03C10.72 12.34 11.58 12 12.6 12H51.8C52.82 12 53.68 12.34 54.37 13.03C55.06 13.72 55.4 14.57 55.4 15.6V44.13C55.4 45.15 55.06 46.01 54.37 46.7C53.68 47.39 52.83 47.73 51.8 47.73H16.47L9 55.2ZM10.47 51.6L15.8 46.27H51.8C52.42 46.27 52.93 46.07 53.33 45.67C53.73 45.27 53.93 44.76 53.93 44.14V15.6C53.93 14.98 53.73 14.47 53.33 14.07C52.93 13.67 52.42 13.47 51.8 13.47H12.6C11.98 13.47 11.47 13.67 11.07 14.07C10.67 14.47 10.47 14.98 10.47 15.6V51.6Z" fill="#D0D0D0"></path> <path opacity="0.05" d="M51.8 42.2696H15.8L10.47 47.5996V51.5996L15.8 46.2696H51.8C52.42 46.2696 52.93 46.0696 53.33 45.6696C53.73 45.2696 53.93 44.7596 53.93 44.1396V40.1396C53.93 40.7596 53.73 41.2696 53.33 41.6696C52.93 42.0696 52.42 42.2696 51.8 42.2696Z" fill="black"></path> </svg>
                                    </div>
                                    <p className='my-[24px] text-[14px] font-[500] text-[#BCBCBC]'>Không có lịch sử đặt hàng trong 3 tháng gần nhất</p>
                                </div>
                            )
                        }
                    </div>
                    // <div className="pt-[150px] pb-[70px] flex flex-col items-center text-center">
                    //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.6} stroke="gray" className="size-20">
                    //         <path opacity="0.4" strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    //     </svg>
                    //     <span className='text-[#BCBCBC] text-[14px] font-[500]'>
                    //         Chưa có đơn hàng nào
                    //     </span>
                    // </div>
                }

                {isStep === 2 &&
                    order?.data?.bills
                        ?.filter((item: any) => item.status_bill === "pending")
                        .map((item: any, index: number) => (
                            <div key={item.id || index} className="">
                                <div className="flex p-[10px] -mx-[15px] lg:m-0 border-t-[#dadada] border-t-[1px] border-b-[#dadada] border-b-[1px] justify-between items-center bg-slate-100 lg:p-[15px]">
                                    <div className="items-center lg:flex">
                                        <div className="mr-[12px] font-[700]">{item.code_orders}</div>
                                        <div className="text-[#787878] text-[14px] font-[500]">
                                            {item.order_date} - {item.order_time}
                                        </div>
                                    </div>
                                    <Link
                                        to={`orders/${item.id}`}
                                        className="text-[14px] text-[#787878] underline cursor-pointer"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>

                                <div className="-mx-[15px] p-[15px] lg:mx-0">
                                    {item?.bill_detail?.map((value: any, detailIndex: number) => (
                                        <div
                                            key={value.id || detailIndex}
                                            className={`${detailIndex === 0 ? "mt-[0]" : "mt-[15px]"}`}
                                        >
                                            <div className="w-[100%] flex">
                                                <div className="w-[120px]">
                                                    <div
                                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                        style={{
                                                            backgroundImage: `url(${value.variation_images?.[1] || ""})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="w-[calc(100%-120px)] pl-[16px] flex items-center">
                                                    <div className="w-[calc(100%-80px)] flex flex-col">
                                                        <h3 className="text-[15px] mb-[4px] font-[500]">
                                                            {value.name}
                                                        </h3>
                                                        <span className="text-[14px] font-[500]">
                                                            BeeStyle / {value.attribute_value_size} / {value.sku}
                                                        </span>
                                                        <span className="text-[14px] font-[500]">
                                                            Số lượng: {value.quantity}
                                                        </span>
                                                        <span className="mt-[14px] font-[700]">
                                                            {new Intl.NumberFormat("ei-VN").format(value.don_gia)} VND
                                                        </span>
                                                    </div>

                                                    {item.status_bill === "delivered" && (
                                                        <div>
                                                            <div
                                                                onClick={() => {
                                                                    setCommentEvaluate(!isCommentEvaluate);
                                                                    setItemProduct(value);
                                                                }}
                                                                className="cursor-pointer rounded-[3px] text-center w-[80px] py-[4px] border-[1px] border-[#B01722] mb-[5px] text-[#B01722]"
                                                            >
                                                                Đánh giá
                                                            </div>
                                                            <div className="cursor-pointer bg-[#B01722] text-white text-center rounded-[3px] w-[80px] py-[4px]">
                                                                Mua lại
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.status_bill === "shipped" && detailIndex === 0 && (
                                                        <div>
                                                            <div className="cursor-pointer rounded-[3px] text-center w-[120px] py-[4px] bg-green-400 mb-[5px] text-white">
                                                                Đã nhận hàng
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                        )
                }

                {isStep === 3 &&
                    order?.data?.bills
                        ?.filter((item: any) => item.status_bill === "processed")
                        .map((item: any, index: number) => (
                            <div key={item.id || index} className="">
                                <div className="flex p-[10px] -mx-[15px] lg:m-0 border-t-[#dadada] border-t-[1px] border-b-[#dadada] border-b-[1px] justify-between items-center bg-slate-100 lg:p-[15px]">
                                    <div className="items-center lg:flex">
                                        <div className="mr-[12px] font-[700]">{item.code_orders}</div>
                                        <div className="text-[#787878] text-[14px] font-[500]">
                                            {item.order_date} - {item.order_time}
                                        </div>
                                    </div>
                                    <Link
                                        to={`orders/${item.id}`}
                                        className="text-[14px] text-[#787878] underline cursor-pointer"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>

                                <div className="-mx-[15px] p-[15px] lg:mx-0">
                                    {item?.bill_detail?.map((value: any, detailIndex: number) => (
                                        <div
                                            key={value.id || detailIndex}
                                            className={`${detailIndex === 0 ? "mt-[0]" : "mt-[15px]"}`}
                                        >
                                            <div className="w-[100%] flex">
                                                <div className="w-[120px]">
                                                    <div
                                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                        style={{
                                                            backgroundImage: `url(${value.variation_images?.[1] || ""})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="w-[calc(100%-120px)] pl-[16px] flex items-center">
                                                    <div className="w-[calc(100%-80px)] flex flex-col">
                                                        <h3 className="text-[15px] mb-[4px] font-[500]">
                                                            {value.name}
                                                        </h3>
                                                        <span className="text-[14px] font-[500]">
                                                            BeeStyle / {value.attribute_value_size} / {value.sku}
                                                        </span>
                                                        <span className="text-[14px] font-[500]">
                                                            Số lượng: {value.quantity}
                                                        </span>
                                                        <span className="mt-[14px] font-[700]">
                                                            {new Intl.NumberFormat("ei-VN").format(value.don_gia)} VND
                                                        </span>
                                                    </div>

                                                    {item.status_bill === "delivered" && (
                                                        <div>
                                                            <div
                                                                onClick={() => {
                                                                    setCommentEvaluate(!isCommentEvaluate);
                                                                    setItemProduct(value);
                                                                }}
                                                                className="cursor-pointer rounded-[3px] text-center w-[80px] py-[4px] border-[1px] border-[#B01722] mb-[5px] text-[#B01722]"
                                                            >
                                                                Đánh giá
                                                            </div>
                                                            <div className="cursor-pointer bg-[#B01722] text-white text-center rounded-[3px] w-[80px] py-[4px]">
                                                                Mua lại
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.status_bill === "shipped" && detailIndex === 0 && (
                                                        <div>
                                                            <div className="cursor-pointer rounded-[3px] text-center w-[120px] py-[4px] bg-green-400 mb-[5px] text-white">
                                                                Đã nhận hàng
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                        )
                }

                {isStep === 4 &&
                    order?.data?.bills
                        ?.filter((item: any) => item.status_bill === "shipped")
                        .map((item: any, index: number) => (
                            <div key={item.id || index} className="">
                                <div className="flex p-[10px] -mx-[15px] lg:m-0 border-t-[#dadada] border-t-[1px] border-b-[#dadada] border-b-[1px] justify-between items-center bg-slate-100 lg:p-[15px]">
                                    <div className="items-center lg:flex">
                                        <div className="mr-[12px] font-[700]">{item.code_orders}</div>
                                        <div className="text-[#787878] text-[14px] font-[500]">
                                            {item.order_date} - {item.order_time}
                                        </div>
                                    </div>
                                    <Link
                                        to={`orders/${item.id}`}
                                        className="text-[14px] text-[#787878] underline cursor-pointer"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>

                                <div className="-mx-[15px] p-[15px] lg:mx-0">
                                    {item?.bill_detail?.map((value: any, detailIndex: number) => (
                                        <div
                                            key={value.id || detailIndex}
                                            className={`${detailIndex === 0 ? "mt-[0]" : "mt-[15px]"}`}
                                        >
                                            <div className="w-[100%] flex">
                                                <div className="w-[120px]">
                                                    <div
                                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                        style={{
                                                            backgroundImage: `url(${value.variation_images?.[1] || ""})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="w-[calc(100%-120px)] pl-[16px] flex items-center">
                                                    <div className="w-[calc(100%-80px)] flex flex-col">
                                                        <h3 className="text-[15px] mb-[4px] font-[500]">
                                                            {value.name}
                                                        </h3>
                                                        <span className="text-[14px] font-[500]">
                                                            BeeStyle / {value.attribute_value_size} / {value.sku}
                                                        </span>
                                                        <span className="text-[14px] font-[500]">
                                                            Số lượng: {value.quantity}
                                                        </span>
                                                        <span className="mt-[14px] font-[700]">
                                                            {new Intl.NumberFormat("ei-VN").format(value.don_gia)} VND
                                                        </span>
                                                    </div>

                                                    {item.status_bill === "delivered" && (
                                                        <div>
                                                            <div
                                                                onClick={() => {
                                                                    setCommentEvaluate(!isCommentEvaluate);
                                                                    setItemProduct(value);
                                                                }}
                                                                className="cursor-pointer rounded-[3px] text-center w-[80px] py-[4px] border-[1px] border-[#B01722] mb-[5px] text-[#B01722]"
                                                            >
                                                                Đánh giá
                                                            </div>
                                                            <div className="cursor-pointer bg-[#B01722] text-white text-center rounded-[3px] w-[80px] py-[4px]">
                                                                Mua lại
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.status_bill === "shipped" && detailIndex === 0 && (
                                                        <div>
                                                            <div className="cursor-pointer rounded-[3px] text-center w-[120px] py-[4px] bg-green-400 mb-[5px] text-white">
                                                                Đã nhận hàng
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                        )
                }
                {isStep === 5 &&
                    order?.data?.bills
                        ?.filter((item: any) => item.status_bill === "delivered")
                        .map((item: any, index: number) => (
                            <div key={item.id || index} className="">
                                <div className="flex p-[10px] -mx-[15px] lg:m-0 border-t-[#dadada] border-t-[1px] border-b-[#dadada] border-b-[1px] justify-between items-center bg-slate-100 lg:p-[15px]">
                                    <div className="items-center lg:flex">
                                        <div className="mr-[12px] font-[700]">{item.code_orders}</div>
                                        <div className="text-[#787878] text-[14px] font-[500]">
                                            {item.order_date} - {item.order_time}
                                        </div>
                                    </div>
                                    <Link
                                        to={`orders/${item.id}`}
                                        className="text-[14px] text-[#787878] underline cursor-pointer"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>

                                <div className="-mx-[15px] p-[15px] lg:mx-0">
                                    {item?.bill_detail?.map((value: any, detailIndex: number) => (
                                        <div
                                            key={value.id || detailIndex}
                                            className={`${detailIndex === 0 ? "mt-[0]" : "mt-[15px]"}`}
                                        >
                                            <div className="w-[100%] flex">
                                                <div className="w-[120px]">
                                                    <div
                                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                        style={{
                                                            backgroundImage: `url(${value.variation_images?.[1] || ""})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="w-[calc(100%-120px)] pl-[16px] flex items-center">
                                                    <div className="w-[calc(100%-80px)] flex flex-col">
                                                        <h3 className="text-[15px] mb-[4px] font-[500]">
                                                            {value.name}
                                                        </h3>
                                                        <span className="text-[14px] font-[500]">
                                                            BeeStyle / {value.attribute_value_size} / {value.sku}
                                                        </span>
                                                        <span className="text-[14px] font-[500]">
                                                            Số lượng: {value.quantity}
                                                        </span>
                                                        <span className="mt-[14px] font-[700]">
                                                            {new Intl.NumberFormat("ei-VN").format(value.don_gia)} VND
                                                        </span>
                                                    </div>

                                                    {item.status_bill === "delivered" && (
                                                        <div>
                                                            {value.status_comment === 0 ?
                                                                <div
                                                                    onClick={() => {
                                                                        setCommentEvaluate(!isCommentEvaluate);
                                                                        setItemProduct(value);
                                                                    }}
                                                                    className="cursor-pointer rounded-[3px] text-center w-[80px] py-[4px] border-[1px] border-[#B01722] mb-[5px] text-[#B01722]">Đánh giá</div>
                                                                : ""}
                                                            <Link to={`/products/${value.product_id}`} className="p-[14px] cursor-pointer bg-[#B01722] text-white text-center rounded-[3px] w-[80px] py-[5px]">
                                                                Mua lại
                                                            </Link>
                                                        </div>
                                                    )}

                                                    {item.status_bill === "shipped" && detailIndex === 0 && (
                                                        <div>
                                                            <div className="cursor-pointer rounded-[3px] text-center w-[120px] py-[4px] bg-green-400 mb-[5px] text-white">
                                                                Đã nhận hàng
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                        )
                }

                {isStep === 6 &&
                    order?.data?.bills
                        ?.filter((item: any) => item.status_bill === "canceled" || item.status_bill === "returned")
                        .map((item: any, index: number) => (
                            <div key={item.id || index} className="">
                                <div className="flex p-[10px] -mx-[15px] lg:m-0 border-t-[#dadada] border-t-[1px] border-b-[#dadada] border-b-[1px] justify-between items-center bg-slate-100 lg:p-[15px]">
                                    <div className="items-center lg:flex">
                                        <div className="mr-[12px] font-[700]">{item.code_orders}</div>
                                        <div className="text-[#787878] text-[14px] font-[500]">
                                            {item.order_date} - {item.order_time}
                                        </div>
                                    </div>
                                    <Link
                                        to={`orders/${item.id}`}
                                        className="text-[14px] text-[#787878] underline cursor-pointer"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>

                                <div className="-mx-[15px] p-[15px] lg:mx-0">
                                    {item?.bill_detail?.map((value: any, detailIndex: number) => (
                                        <div
                                            key={value.id || detailIndex}
                                            className={`${detailIndex === 0 ? "mt-[0]" : "mt-[15px]"}`}
                                        >
                                            <div className="w-[100%] flex">
                                                <div className="w-[120px]">
                                                    <div
                                                        className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                        style={{
                                                            backgroundImage: `url(${value.variation_images?.[1] || ""})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="w-[calc(100%-120px)] pl-[16px] flex items-center">
                                                    <div className="w-[calc(100%-80px)] flex flex-col">
                                                        <h3 className="text-[15px] mb-[4px] font-[500]">
                                                            {value.name}
                                                        </h3>
                                                        <span className="text-[14px] font-[500]">
                                                            BeeStyle / {value.attribute_value_size} / {value.sku}
                                                        </span>
                                                        <span className="text-[14px] font-[500]">
                                                            Số lượng: {value.quantity}
                                                        </span>
                                                        <span className="mt-[14px] font-[700]">
                                                            {new Intl.NumberFormat("ei-VN").format(value.don_gia)} VND
                                                        </span>
                                                    </div>

                                                    {item.status_bill === "delivered" && (
                                                        <div>
                                                            {value.status_comment === 0 ?
                                                                <div
                                                                    onClick={() => {
                                                                        setCommentEvaluate(!isCommentEvaluate);
                                                                        setItemProduct(value);
                                                                    }}
                                                                    className="cursor-pointer rounded-[3px] text-center w-[80px] py-[4px] border-[1px] border-[#B01722] mb-[5px] text-[#B01722]">Đánh giá</div>
                                                                : ""}
                                                            <div className="cursor-pointer bg-[#B01722] text-white text-center rounded-[3px] w-[80px] py-[4px]">
                                                                Mua lại
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.status_bill === "shipped" && detailIndex === 0 && (
                                                        <div>
                                                            <div className="cursor-pointer rounded-[3px] text-center w-[120px] py-[4px] bg-green-400 mb-[5px] text-white">
                                                                Đã nhận hàng
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                        )
                }




                <div className="">
                    <div className={`${isCommentEvaluate ? "" : "hidden"} fixed z-10 flex-col top-0`}>
                        <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] min-w-[300px] max-w-[500px] max-h-[600px] w-[100%] p-[20px]">
                            <form action="" onSubmit={handleSubmit(onSubmit)}>
                                <h3 className='text-[18px] font-[600] mb-[15px]'>Đánh Giá Sản Phẩm</h3>
                                {/* <input type="hidden" {...register("start")} defaultValue={start}/> */}
                                <div className="flex justify-between items-center mb-[10px]">
                                    <span className=''>Đánh giá chất lượng sản phẩm:</span>
                                    <div style={{ display: 'flex' }}>
                                        {[...Array(5)].map((_, index) => {
                                            const startValue = index + 1;
                                            return (
                                                <svg key={index + 1} xmlns="http://www.w3.org/2000/svg"
                                                    fill={startValue <= start ? "gold" : "gray"}
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="none"
                                                    className="size-8"
                                                    onClick={() => setStart(startValue)}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                            );
                                        })}
                                    </div>
                                </div>
                                <textarea {...register("content")} id="" placeholder='Thêm đánh giá chi tiết tại đây...' className='w-[100%] bg-slate-100 p-[10px] rounded-[3px] outline-none'></textarea>
                                <div className="flex mt-5 justify-end">
                                    <div onClick={() => setCommentEvaluate(!isCommentEvaluate)} className="cursor-pointer mr-5 text-black bg-slate-50 p-[10px_30px] rounded font-medium">
                                        Hủy
                                    </div>
                                    <button type="submit" className="text-white bg-black p-[10px_40px] rounded font-medium">
                                        Đánh giá
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
                    </div>
                    <hr />

                    <div className="pt-[24px] lg:flex justify-between lg:pt-[48px]">
                        <div className="py-[24px] flex justify-center border-[1px] border-[#E8E8E8] lg:w-[33.333%]">
                            <Link to={`/account/wishlist`} className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none"> <rect x="0.5" width="64" height="64" rx="32" fill="#F8F8F8"></rect> <g clipPath="url(#icon-account-1)"> <path d="M31.9388 44.7709C32.2501 45.0774 32.7499 45.0774 33.0612 44.7709L43.8308 34.1688C47.1231 30.9277 47.1231 25.6675 43.8308 22.4265C40.7266 19.3705 35.8046 19.2021 32.5 21.921C29.1954 19.2021 24.2734 19.3705 21.1692 22.4265C17.8769 25.6675 17.8769 30.9277 21.1692 34.1688L31.9388 44.7709Z" fill="white" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path> <path fillRule="evenodd" clipRule="evenodd" d="M30.7578 42.484L41.3885 31.9459C43.9186 29.4379 44.4307 25.687 42.9249 22.6758C43.0426 22.7783 43.1579 22.8849 43.2705 22.9958C46.2444 25.9235 46.2444 30.6702 43.2705 33.5979L32.501 44.2L30.7578 42.484Z" fill="#E8E8E8"></path> <path d="M23.9581 30.8165C22.6364 29.5153 22.6364 27.4057 23.9581 26.1045C24.5664 25.5057 25.3485 25.1824 26.1446 25.1348M26.4335 33.2175L25.8146 32.6172" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"></path> </g> <defs> <clipPath id="icon-account-1"> <rect width="52" height="52" fill="white" transform="translate(6.5 6)"></rect> </clipPath> </defs> </svg>
                                <span>Wishlist</span>
                            </Link>
                        </div>
                        <div className="py-[24px] flex justify-center border-[1px] border-[#E8E8E8] lg:w-[33.333%]">
                            <div className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none"> <rect x="0.5" width="64" height="64" rx="32" fill="#F8F8F8"></rect> <g clipPath="url(#icon-account-2)"> <path fillRule="evenodd" clipRule="evenodd" d="M36.5058 33.1065H28.4942V27.2031L16.6875 37.165L28.4942 47.1269V41.2236H45.4855V33.1065H40.8798L36.5058 36.797V33.1065Z" fill="#E8E8E8"></path> <path d="M36.5058 33.1065H37.2058C37.2058 32.7199 36.8924 32.4065 36.5058 32.4065V33.1065ZM28.4942 33.1065H27.7942C27.7942 33.4931 28.1076 33.8065 28.4942 33.8065V33.1065ZM28.4942 27.2031H29.1942C29.1942 26.9307 29.0362 26.6831 28.7891 26.5683C28.5421 26.4535 28.2509 26.4925 28.0428 26.6681L28.4942 27.2031ZM16.6875 37.165L16.2361 36.63C16.0785 36.763 15.9875 36.9588 15.9875 37.165C15.9875 37.3712 16.0785 37.567 16.2361 37.7L16.6875 37.165ZM28.4942 47.1269L28.0428 47.6619C28.2509 47.8375 28.5421 47.8765 28.7891 47.7617C29.0362 47.6469 29.1942 47.3993 29.1942 47.1269H28.4942ZM28.4942 41.2236V40.5236C28.1076 40.5236 27.7942 40.837 27.7942 41.2236H28.4942ZM45.4855 41.2236V41.9236C45.8721 41.9236 46.1855 41.6102 46.1855 41.2236H45.4855ZM45.4855 33.1065H46.1855C46.1855 32.7199 45.8721 32.4065 45.4855 32.4065V33.1065ZM40.8798 33.1065V32.4065C40.7145 32.4065 40.5546 32.4649 40.4283 32.5715L40.8798 33.1065ZM36.5058 36.797H35.8058C35.8058 37.0694 35.9638 37.317 36.2109 37.4318C36.4579 37.5466 36.7491 37.5076 36.9572 37.332L36.5058 36.797ZM36.5058 32.4065H28.4942V33.8065H36.5058V32.4065ZM29.1942 33.1065V27.2031H27.7942V33.1065H29.1942ZM28.0428 26.6681L16.2361 36.63L17.1389 37.7L28.9456 27.7381L28.0428 26.6681ZM16.2361 37.7L28.0428 47.6619L28.9456 46.5919L17.1389 36.63L16.2361 37.7ZM29.1942 47.1269V41.2236H27.7942V47.1269H29.1942ZM28.4942 41.9236H45.4855V40.5236H28.4942V41.9236ZM46.1855 41.2236V33.1065H44.7855V41.2236H46.1855ZM45.4855 32.4065H40.8798V33.8065H45.4855V32.4065ZM40.4283 32.5715L36.0544 36.262L36.9572 37.332L41.3312 33.6415L40.4283 32.5715ZM37.2058 36.797V33.1065H35.8058V36.797H37.2058Z" fill="black"></path> <path fillRule="evenodd" clipRule="evenodd" d="M28.4942 30.8935V27.203L24.1202 30.8935H19.5145V22.7764H36.5058V16.8731L48.3125 26.835L36.5058 36.7969V30.8935H28.4942Z" fill="white"></path> <path d="M28.4942 30.8935H27.7942C27.7942 31.2801 28.1076 31.5935 28.4942 31.5935V30.8935ZM28.4942 27.203H29.1942C29.1942 26.9306 29.0362 26.683 28.7891 26.5682C28.5421 26.4534 28.2509 26.4924 28.0428 26.668L28.4942 27.203ZM24.1202 30.8935V31.5935C24.2855 31.5935 24.4454 31.5351 24.5717 31.4285L24.1202 30.8935ZM19.5145 30.8935H18.8145C18.8145 31.2801 19.1279 31.5935 19.5145 31.5935V30.8935ZM19.5145 22.7764V22.0764C19.1279 22.0764 18.8145 22.3898 18.8145 22.7764H19.5145ZM36.5058 22.7764V23.4764C36.8924 23.4764 37.2058 23.163 37.2058 22.7764H36.5058ZM36.5058 16.8731L36.9572 16.3381C36.7491 16.1625 36.4579 16.1235 36.2109 16.2383C35.9638 16.3531 35.8058 16.6007 35.8058 16.8731H36.5058ZM48.3125 26.835L48.7639 27.37C48.9215 27.237 49.0125 27.0412 49.0125 26.835C49.0125 26.6288 48.9215 26.433 48.7639 26.3L48.3125 26.835ZM36.5058 36.7969H35.8058C35.8058 37.0693 35.9638 37.3169 36.2109 37.4317C36.4579 37.5465 36.7491 37.5075 36.9572 37.3319L36.5058 36.7969ZM36.5058 30.8935H37.2058C37.2058 30.5069 36.8924 30.1935 36.5058 30.1935V30.8935ZM29.1942 30.8935V27.203H27.7942V30.8935H29.1942ZM28.0428 26.668L23.6688 30.3585L24.5717 31.4285L28.9456 27.738L28.0428 26.668ZM19.5145 31.5935H24.1202V30.1935H19.5145V31.5935ZM18.8145 22.7764V30.8935H20.2145V22.7764H18.8145ZM36.5058 22.0764H19.5145V23.4764H36.5058V22.0764ZM35.8058 16.8731V22.7764H37.2058V16.8731H35.8058ZM48.7639 26.3L36.9572 16.3381L36.0544 17.4081L47.8611 27.37L48.7639 26.3ZM36.9572 37.3319L48.7639 27.37L47.8611 26.3L36.0544 36.2619L36.9572 37.3319ZM35.8058 30.8935V36.7969H37.2058V30.8935H35.8058ZM28.4942 31.5935H36.5058V30.1935H28.4942V31.5935Z" fill="black"></path> </g> <defs> <clipPath id="icon-account-2"> <rect width="52" height="52" fill="white" transform="translate(6.5 6)"></rect> </clipPath> </defs> </svg>
                                <span>Hủy/Đổi/Trả</span>
                            </div>
                        </div>
                        <div className="py-[24px] flex justify-center border-[1px] border-[#E8E8E8] lg:w-[33.333%]">
                            <div className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none"> <rect x="0.5" width="64" height="64" rx="32" fill="#F8F8F8"></rect> <g clipPath="url(#icon-account-3)"> <rect x="18.3" y="25.8" width="28.4" height="21.4" rx="4.2" fill="white" stroke="black" strokeWidth="1.6"></rect> <path d="M26.5 25V22.5C26.5 18.9101 29.4101 16 33 16H33.3C36.2257 16 38.6781 18.0265 39.3301 20.7524" stroke="black" strokeWidth="1.6" strokeLinecap="round"></path> <circle cx="32.4993" cy="34.3098" r="3.30985" fill="#E8E8E8" stroke="black" strokeWidth="1.4" strokeLinecap="square"></circle> <path d="M40.5 46.5V46.5C40.5 43.7386 38.2614 41.5 35.5 41.5H29.5C26.7386 41.5 24.5 43.7386 24.5 46.5V46.5" stroke="black" strokeWidth="1.4" strokeLinecap="round"></path> </g> <defs> <clipPath id="icon-account-3"> <rect width="52" height="52" fill="white" transform="translate(6.5 6)"></rect> </clipPath> </defs> </svg>
                                <span>Quản lý tài khoản</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewAccount