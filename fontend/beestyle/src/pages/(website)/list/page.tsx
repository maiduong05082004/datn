import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import LoadingPage from '../loading/loadPage'
import ProductsList from './_components/product'

const ListPage = () => {

    const [filter, setFilter] = useState<boolean>(false)
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);
    const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(false);
    const [isPriceMenuOpen, setIsPriceMenuOpen] = useState(false);

    const { id } = useParams()
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [sizeIds, setSizeIds] = useState<string[]>([]);
    const [color, setColor] = useState<string[]>([]);
    const [priceCheck, setPiceCheck] = useState<string>("");

    const { data: products, isLoading } = useQuery({
        queryKey: ['products', id, categoryIds, sizeIds, priceCheck, color],
        queryFn: () => {
            return axios.post(`http://127.0.0.1:8000/api/client/categories/${id}`, { sizes: sizeIds.length === 0 ? "" : sizeIds, category_ids: categoryIds.length === 0 ? "" : categoryIds, price_range: priceCheck, colors: color.length === 0 ? "" : color })
        }
    })


    const { data: categoryChildren } = useQuery({
        queryKey: ['categoryChildren', id],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/categories/${id}/children`)
        }
    })

    const { data: colors } = useQuery({
        queryKey: ['colors'],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/categories/colors`)
        }
    })

    const { data: size } = useQuery({
        queryKey: ['size'],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/categories/${id}/sizes`)
        }
    })

    const toggleSelect = (id: string) => {
        setCategoryIds((prev: any) =>
            prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]
        );
    };
    const toggleSize = (id: string) => {
        setSizeIds((prev: any) =>
            prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]
        );
    };
    const toggleColor = (id: string) => {
        setColor((prev: any) =>
            prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]
        );
    };

    if (isLoading) return <LoadingPage />
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
        <main>
            {/* <div className="my-[15px] text-center flex justify-center lg:my-[30px]">
                <h1 className='text-[24px] font-[650] lg:text-[32px]'>Quần Áo</h1>
            </div>

            <div className="">
                <div className="*:text-[14px] font-[500] leading-5 px-[15px] relative pc:px-[48px]">
                    <div style={{
                        // maxHeight: todo ? '100px' : '',
                        overflow: 'hidden',
                    }} className="">
                        <p className="text-center">
                            Bộ sưu tập&nbsp;
                            <strong>Quần</strong>&nbsp;
                            <strong>Áo BEESTYLE</strong>&nbsp;
                            tại BEESTYLE Việt Nam - Thời trang thể thao đa dạng.
                        </p>
                        <p className="text-center">
                            &nbsp;
                        </p>
                        <p className="text-center">
                            <strong>BEESTYLE Việt Nam</strong>&nbsp;
                            tự hào giới thiệu bộ sưu tập Áo BEESTYLE với thiết kế
                            đa dạng từ áo phông, áo hoodie đến áo khoác, sử dụng
                            chất liệu thoáng khí và co giãn để mang đến sự thoải
                            mái và linh hoạt khi bạn vận động. Khám phá bộ sưu tập&nbsp;
                            <strong>Quần</strong>
                            &nbsp;
                            <strong>Áo BEESTYLE</strong>
                            &nbsp;
                            và tạo nên phong cách thể thao đẳng cấp và nổi bật.
                        </p>
                    </div>
                    <div className="w-full h-full lg:hidden">
                        <div className="absolute h-[100px] w-[100%] bottom-[30px] bg-gradient-to-t from-white to-transparent"></div>

                        <div className="mt-[10px] mb-[20px] text-center bg-white w-full h-full">
                            <span className='cursor-pointer border-b-[#808080] border-b-[1px] pb-[2px] bg-white'>Xem thêm</span>
                            <span className='cursor-pointer border-b-[#808080] border-b-[1px] pb-[2px]'>Rút gọn</span>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="px-[15px] py-[10px] mb-[20px] border-t-[##e8e8e8] border-b-[#e8e8e8] border-t-[1px] border-b-[1px] lg:py-[20px] lg:mb-[8px] lg:border-none pc:px-[48px]">
                <div className="block lg:justify-between lg:items-center lg:px-0 lg:flex">

                    <div className="*:text-[12px] *:font-[500] hidden lg:block">
                    </div>

                    <div className="flex justify-between">
                        <div onClick={() => setFilter(!filter)} className="flex py-[5px] cursor-pointer items-center lg:border-[#E8E8E8] lg:border-[1px] lg:px-[16px] lg:py-[10px] lg:rounded-[4px]">
                            <span className='mr-[5px] text-[14px] font-[500] lg:mr-[20px]'>Bộ lọc</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1.33325 2.66699H8.83325" stroke="black" strokeLinecap="square"></path><path d="M12.1665 2.66699L14.6665 2.66699" stroke="black" strokeLinecap="square"></path><path d="M7.1665 9.33301L14.6665 9.33301" stroke="black" strokeLinecap="square"></path><path d="M1.33325 9.33301H3.83325" stroke="black" strokeLinecap="square"></path><ellipse cx="5.49992" cy="9.33366" rx="1.66667" ry="1.66667" stroke="black"></ellipse><ellipse cx="10.4999" cy="2.66667" rx="1.66667" ry="1.66667" stroke="black"></ellipse></svg>
                        </div>
                    </div>
                </div>
            </div>

            <ProductsList products={products} />

            <div className={`${filter ? "flex" : "hidden"} step fixed max-w-[440px] w-[100%] top-0 right-0 z-20 flex-col justify-between h-full`}>
                <div className="relative bg-white z-20 h-full filter">
                    <div className="flex justify-between items-center p-[8px_20px] shadow-sm">
                        <h2 className="text-lg font-semibold">Bộ lọc</h2>
                        <div onClick={() => setFilter(!filter)} className="flex cursor-pointer w-[40px] h-[40px] justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18" stroke="black" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round"></path><path d="M6 6L18 18" stroke="black" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round"></path></svg>
                        </div>
                    </div>
                    <div className="absolute bottom-0 bg-slate-400 w-[100%]">
                        <div className="bg-[#F8F8F8] min-h-[58px] p-[10px] flex">
                            <div onClick={() => { setPiceCheck(""), setColor([]), setSizeIds([]), setCategoryIds([]) }} className="flex items-center cursor-pointer text-black mr-[10px] min-w-[75px]">
                                <span className='mr-[3px] text-[16px] font-[500]'>Xóa lọc</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.5 3C11.5376 3 14 5.46243 14 8.5C14 11.5376 11.5376 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 6.77223 3.79669 5.23053 5.04274 4.22222" stroke="black" strokeLinecap="square"></path><path d="M3 3.9165H5.44444V6.36095" stroke="black" strokeLinecap="square"></path></svg>
                            </div>
                            <div className="flex flex-wrap">
                                {categoryIds.length > 0 &&
                                    categoryIds.map((item: any) => (
                                        <div className="p-[2px_10px] rounded-full mb-[5px] mr-[5px] bg-black text-white flex items-center">
                                            <span className='text-[12px]'>{item}</span>
                                            <svg className='ml-[5px]' xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M7.19995 0.800049L0.80005 7.20005" stroke="#F8F8F8" strokeLinecap="square" strokeLinejoin="round"></path><path d="M0.800049 0.800049L7.19995 7.20005" stroke="#F8F8F8" strokeLinecap="square" strokeLinejoin="round"></path></svg>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div onClick={() => setFilter(!filter)} className=" cursor-pointer bg-black h-[56px] flex justify-center px-[20px] items-center">
                            <span className="cursor-pointer text-white text-[16px] font-[700]">Xem {products?.data?.products?.length ? products?.data?.products.length : "0"} sản phẩm</span>
                        </div>
                    </div>
                    <div className="p-[48px_24px] h-full overflow-y-auto whitespace-nowrap scrollbar">
                        <div className="">
                            <div onClick={() => setIsColorMenuOpen(!isColorMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="font-medium">Màu sắc</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                    {isColorMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isColorMenuOpen && (
                                <div className="grid grid-cols-8 gap-6 mt-[26px] mb-[46px]">
                                    {colors?.data.colors.map((item: any) => (
                                        <div onClick={() => toggleColor(item.name)} className="relative w-6 h-6  cursor-pointe ">
                                            <img className='rounded-full' src={item.image} alt="" />
                                            <div className={`${color.includes(item.name)
                                                ? 'border-[2px] border-black'
                                                : ''} absolute rounded-full h-9 w-9 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] bg-transparent`}></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-[16px]">
                            <div onClick={() => setIsDesignMenuOpen(!isDesignMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="font-medium cursor-pointer select-none">Loại sản phẩm</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                    {isDesignMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isDesignMenuOpen && (
                                <div className="flex flex-wrap justify-start mt-[26px] mb-[46px] ">
                                    <div className="flex flex-wrap justify-start mb-[46px] ">
                                        {categoryChildren?.data?.categories?.children.map((item: any) => (
                                            item.children.length > 0 ? (
                                                item.children.map((item: any) => (
                                                    <div onClick={() => toggleSelect(item.id)} className={`${categoryIds.includes(item.id)
                                                        ? 'bg-black text-white'
                                                        : 'bg-white text-black'
                                                        } cursor-pointer select-none  px-4 py-2 rounded-full border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px] text-[12px]`}>
                                                        {item.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="cursor-pointer select-none bg-white text-black px-4 py-2 rounded-full border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px] text-[12px]">
                                                    {item.name}
                                                </div>
                                            )
                                        ))}

                                    </div>

                                </div>)}
                        </div>
                        <div className="mt-[16px]">
                            <div onClick={() => setIsSizeMenuOpen(!isSizeMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="font-medium cursor-pointer select-none">Kích thước</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                    {isSizeMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isSizeMenuOpen && (
                                <div className="flex flex-wrap justify-start mt-[26px] mb-[46px] ">
                                    {size?.data?.attributes.map((item: any) => (
                                        item.value.map((value: any, index: any) => (

                                            <div key={index + 1} onClick={() => toggleSize(value)} className={`${sizeIds.includes(value)
                                                ? 'bg-black text-white'
                                                : 'bg-white text-black'}
                                                   cursor-pointer select-none flex justify-center items-center w-[40px] h-[40px] px-4 py-2 border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px]`}>
                                                {value}
                                            </div>
                                        ))
                                    ))}
                                </div>)}
                        </div>
                        <div className="mt-[16px] mb-[150px]">
                            <div onClick={() => setIsPriceMenuOpen(!isPriceMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="cursor-pointer select-none  font-medium">Giá</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                    {isPriceMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isPriceMenuOpen && (
                                <div className="flex flex-col mt-[26px] mb-[46px] ">
                                    <div className=" cursor-pointer select-none flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("under_1m")} checked={priceCheck === "under_1m"} id="under_1m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="under_1m" className='ml-[10px]'>Dưới 1.000.000 VND</label>
                                    </div>
                                    <div className="flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("1m_to_2m")} checked={priceCheck === "1m_to_2m"} id="1m_to_2m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="1m_to_2m" className='ml-[10px]'>1.000.000 - 2.000.000 VND</label>
                                    </div>
                                    <div className="flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("2m_to_3m")} checked={priceCheck === "2m_to_3m"} id="2m_to_3m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="2m_to_3m" className='ml-[10px]'>2.000.000 - 3.000.000 VND</label>
                                    </div>
                                    <div className="flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("above_4m")} checked={priceCheck === "above_4m"} id="above_4m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="above_4m" className='ml-[10px]'>Trên 4.000.000 VND</label>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
                <div onClick={() => setFilter(!filter)} className=" block bg-black opacity-[0.24] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
            </div>

        </main>
    )
}

export default ListPage