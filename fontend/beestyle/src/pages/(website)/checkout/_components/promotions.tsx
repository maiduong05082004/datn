// ... existing imports ...
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type Props = {
    setPromotion: any,
    isPromotion: any,
    setPromotionAdd: any
}

const Promotions = ({ isPromotion, setPromotion, setPromotionAdd }: Props) => {
    const { data: promotions } = useQuery({
        queryKey: ['promotions'],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/promotions/available-promotions`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
        },
    });

    const location = useLocation();
    const checkouts = location.state || { selectedItems: [] };
    const totalPrice = checkouts.totalPrice;
    const [promotion, setPromotionList] = useState<any>(JSON.parse(localStorage.getItem('promotions') || '[]'));

    const handleClickPromotion = (item: any) => {
        const existingShipping = promotion.find((promo: any) => promo.promotion_type === "shipping");
        const existingProduct = promotion.find((promo: any) => promo.promotion_type !== "shipping");

        if (item.promotion_type === "shipping") {
            if (existingShipping && !promotion.some((promo: any) => promo.id === item.id)) return;
        } else {
            if (existingProduct && !promotion.some((promo: any) => promo.id === item.id)) return;
        }

        let updatedPromotion;
        if (promotion.some((promo: any) => promo.id === item.id)) {
            updatedPromotion = promotion.filter((promo: any) => promo.id !== item.id);
        } else {
            updatedPromotion = [...promotion, item];
        }

        setPromotionList(updatedPromotion);
        localStorage.setItem('promotions', JSON.stringify(updatedPromotion));
    };

    useEffect(() => {
        return () => {
            setPromotionList([]);
            localStorage.removeItem('promotions');
        };
    }, []);

    const handleSubmitVoucher = () => {
        setPromotionAdd(promotion);
        setPromotion(!isPromotion);
    }

    return (
        <div className={`${isPromotion ? "" : "hidden"} step fixed z-10 flex-col top-0`}>
            <div className="fixed bg-white z-20 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] max-w-[500px] max-h-[500px] w-[100%]">
                <div onClick={() => setPromotion(!isPromotion)} className="absolute right-0 cursor-pointer p-[5px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
                <div className="flex w-[100%] justify-center p-[24px]">CHỌN GIẢM GIÁ</div>
                <div className="p-[16px_32px] pt-[0] overflow-x-auto max-h-[400px]">
                    {promotions?.data.length > 0 ?
                        promotions?.data?.map((item: any) => {
                            const isDisabled = totalPrice < item.min_order_value || item.status === "upcoming";
                            return (
                                <div
                                    key={item.id}
                                    className={`${promotion.some((promo: any) => promo.promotion_type === item.promotion_type && promo.id !== item.id) || isDisabled ? "bg-slate-300 opacity-50 pointer-events-none" : ""} select-none border-[1px] border-[#787878] mb-[10px] flex items-center relative`}>
                                    
                                    {item.status === "upcoming" && (
                                        <div className="absolute top-4 right-12 border border-red-300 text-red-400 text-xs px-2 py-0.5 inline-block">
                                            Sắp diễn ra
                                        </div>
                                    )}

                                    <div className="w-[calc(100%-20px)] h-[100%] border-r-[1px] border-dashed border-r-[#787878]">
                                        <div className="flex px-[16px] pt-[10px] items-center">
                                            {item.promotion_type !== "shipping" ? (
                                                <div className="mr-[10px] w-[37px]">
                                                    <svg width="37" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M28.4325 45.5026C27.418 45.5026 26.5115 44.7611 25.631 44.0411C25.093 43.6006 24.3555 42.9976 23.9995 42.9976C23.644 42.9976 22.9065 43.6006 22.3685 44.0411C21.404 44.8296 20.31 45.7261 19.1055 45.4501C17.8625 45.1676 17.254 43.8606 16.717 42.7081C16.449 42.1316 16.043 41.2601 15.7545 41.1206C15.4485 40.9711 14.4985 41.2016 13.87 41.3526C12.6465 41.6471 11.2605 41.9791 10.2805 41.1976C9.297 40.4121 9.3145 38.9816 9.331 37.7201C9.339 37.0766 9.351 36.1046 9.144 35.8446C8.9395 35.5886 7.993 35.3861 7.3665 35.2521C6.1275 34.9871 4.7245 34.6866 4.1745 33.5466C3.6325 32.4241 4.265 31.1511 4.822 30.0281C5.1115 29.4461 5.5485 28.5656 5.472 28.2281C5.403 27.9256 4.65 27.3411 4.152 26.9541C3.1435 26.1721 2 25.2841 2 24.0001C2 22.7161 3.1435 21.8286 4.1525 21.0456C4.6505 20.6591 5.4035 20.0746 5.4725 19.7716C5.549 19.4341 5.112 18.5536 4.823 17.9711C4.2655 16.8481 3.6335 15.5756 4.176 14.4521C4.726 13.3126 6.129 13.0121 7.3675 12.7471C7.994 12.6131 8.9405 12.4106 9.1445 12.1551C9.3525 11.8946 9.3405 10.9221 9.3325 10.2786C9.3165 9.01706 9.299 7.58706 10.282 6.80156C11.2615 6.01956 12.6485 6.35256 13.8715 6.64656C14.501 6.79756 15.45 7.02606 15.7555 6.87906C16.0445 6.73956 16.45 5.86856 16.7185 5.29156C17.255 4.13856 17.863 2.83206 19.106 2.54956C20.309 2.27656 21.405 3.16956 22.369 3.95856C22.9075 4.39906 23.645 5.00206 24.0005 5.00206C24.356 5.00206 25.0935 4.39906 25.6315 3.95906C26.5965 3.16956 27.69 2.27456 28.895 2.54956C30.1375 2.83206 30.746 4.13906 31.283 5.29206C31.5515 5.86856 31.957 6.74006 32.246 6.87956C32.5525 7.02706 33.501 6.79806 34.1295 6.64706C35.353 6.35306 36.7395 6.02006 37.7195 6.80206C38.703 7.58756 38.6855 9.01756 38.669 10.2796C38.661 10.9231 38.649 11.8956 38.856 12.1551C39.0605 12.4106 40.007 12.6136 40.6335 12.7476C41.8725 13.0126 43.2755 13.3126 43.8255 14.4526C44.3675 15.5756 43.735 16.8486 43.178 17.9716C42.8885 18.5541 42.4515 19.4341 42.528 19.7716C42.597 20.0746 43.35 20.6591 43.848 21.0456C44.8565 21.8286 46 22.7161 46 24.0001C46 25.2841 44.8565 26.1716 43.8475 26.9546C43.3495 27.3411 42.5965 27.9251 42.5275 28.2291C42.451 28.5666 42.888 29.4466 43.177 30.0291C43.7345 31.1521 44.3665 32.4246 43.824 33.5481C43.274 34.6876 41.871 34.9881 40.6325 35.2526C40.006 35.3871 39.0595 35.5896 38.855 35.8451C38.6475 36.1056 38.6595 37.0781 38.6675 37.7216C38.6835 38.9826 38.701 40.4126 37.718 41.1981C36.7385 41.9801 35.3515 41.6466 34.1285 41.3531C33.499 41.2021 32.55 40.9726 32.2445 41.1211C31.9555 41.2601 31.55 42.1316 31.2815 42.7081C30.745 43.8616 30.137 45.1681 28.894 45.4506C28.738 45.4861 28.584 45.5026 28.4325 45.5026ZM15.445 39.0751C15.8595 39.0751 16.257 39.1421 16.6235 39.3186C17.555 39.7676 18.051 40.8331 18.5305 41.8636C18.768 42.3736 19.262 43.4346 19.5485 43.4996C19.815 43.5466 20.685 42.8331 21.102 42.4921C22.001 41.7571 22.93 40.9971 23.9995 40.9971C25.069 40.9971 25.9985 41.7576 26.897 42.4921C27.314 42.8331 28.158 43.5326 28.4515 43.4996C28.737 43.4341 29.2315 42.3736 29.4685 41.8636C29.9475 40.8331 30.4435 39.7686 31.3755 39.3186C32.3235 38.8611 33.4775 39.1396 34.595 39.4081C35.1325 39.5371 36.253 39.8066 36.469 39.6346C36.6885 39.4596 36.674 38.3021 36.667 37.7461C36.6525 36.6001 36.6375 35.4156 37.2915 34.5966C37.9415 33.7826 39.096 33.5356 40.213 33.2966C40.76 33.1796 41.8975 32.9361 42.022 32.6786C42.138 32.4371 41.629 31.4111 41.3845 30.9181C40.872 29.8856 40.3415 28.8176 40.5765 27.7856C40.804 26.7846 41.7275 26.0676 42.62 25.3746C43.103 25.0006 44 24.3046 44 24.0001C44 23.6956 43.103 22.9996 42.621 22.6251C41.728 21.9321 40.8045 21.2156 40.577 20.2141C40.3425 19.1821 40.873 18.1141 41.3855 17.0816C41.63 16.5886 42.1395 15.5631 42.023 15.3211C41.8985 15.0631 40.761 14.8201 40.2145 14.7031C39.0975 14.4641 37.9425 14.2171 37.2925 13.4036C36.639 12.5851 36.654 11.4001 36.6685 10.2546C36.6755 9.69856 36.69 8.54056 36.4705 8.36556C36.2555 8.19356 35.1345 8.46306 34.596 8.59206C33.479 8.86056 32.325 9.13856 31.3765 8.68106C30.445 8.23156 29.949 7.16656 29.4695 6.13656C29.232 5.62656 28.7385 4.56556 28.4515 4.50056C28.1765 4.45306 27.3145 5.16706 26.8975 5.50756C25.999 6.24306 25.07 7.00306 24.0005 7.00306C22.931 7.00306 22.002 6.24256 21.103 5.50756C20.686 5.16656 19.816 4.45606 19.5485 4.50006C19.2625 4.56506 18.768 5.62606 18.531 6.13606C18.0515 7.16606 17.556 8.23106 16.6245 8.68056C15.6765 9.13756 14.5225 8.86056 13.4045 8.59156C12.867 8.46206 11.7455 8.19306 11.5305 8.36456C11.311 8.54006 11.3255 9.69756 11.3325 10.2536C11.347 11.3996 11.362 12.5846 10.708 13.4026C10.058 14.2166 8.9035 14.4636 7.7865 14.7026C7.2395 14.8196 6.102 15.0631 5.9775 15.3206C5.8615 15.5621 6.3705 16.5881 6.615 17.0811C7.1275 18.1136 7.658 19.1816 7.423 20.2136C7.1955 21.2146 6.272 21.9316 5.3795 22.6246C4.897 22.9996 4 23.6956 4 24.0001C4 24.3046 4.897 25.0011 5.379 25.3751C6.272 26.0681 7.1955 26.7841 7.423 27.7856C7.6575 28.8176 7.127 29.8851 6.6145 30.9181C6.37 31.4111 5.8605 32.4366 5.977 32.6786C6.1015 32.9371 7.239 33.1801 7.786 33.2971C8.9025 33.5361 10.0575 33.7831 10.7075 34.5971C11.361 35.4156 11.346 36.6001 11.3315 37.7461C11.3245 38.3021 11.31 39.4601 11.5295 39.6351C11.7445 39.8046 12.8655 39.5376 13.404 39.4081C14.0885 39.2431 14.788 39.0751 15.445 39.0751Z" fill="#F47560"></path>
                                                        <path d="M18.207 32.207L32.207 18.207C32.5975 17.8165 32.5975 17.1835 32.207 16.793C31.8165 16.4025 31.1835 16.4025 30.793 16.793L16.793 30.793C16.4025 31.1835 16.4025 31.8165 16.793 32.207C16.9885 32.4025 17.244 32.5 17.5 32.5C17.756 32.5 18.0115 32.4025 18.207 32.207ZM19.5 23C17.5705 23 16 21.43 16 19.5C16 17.57 17.5705 16 19.5 16C21.4295 16 23 17.57 23 19.5C23 21.43 21.4295 23 19.5 23ZM19.5 18C18.673 18 18 18.673 18 19.5C18 20.327 18.673 21 19.5 21C20.327 21 21 20.327 21 19.5C21 18.673 20.327 18 19.5 18ZM29.5 33C27.5705 33 26 31.4295 26 29.5C26 27.5705 27.5705 26 29.5 26C31.4295 26 33 27.5705 33 29.5C33 31.4295 31.4295 33 29.5 33ZM29.5 28C28.673 28 28 28.673 28 29.5C28 30.327 28.673 31 29.5 31C30.327 31 31 30.327 31 29.5C31 28.673 30.327 28 29.5 28Z" fill="#F47560"></path>
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="mr-[10px] w-[37px] border-[1px] border-dashed border-blue-500">
                                                    <img className='bg-blue-500' src="https://down-vn.img.susercontent.com/file/sg-11134004-22120-4cskiffs0olvc3" alt="" />
                                                </div>
                                            )}
                                            <div className="flex justify-center">
                                                <span className='text-[16px] font-[700]'>{item.code}</span>
                                            </div>
                                        </div>
                                        <div className="p-[10px_16px] flex justify-between items-end">
                                            <div>
                                                <ul className='text-[14px]'>
                                                    <li>Giảm {item?.discount_type == 'percent' ?
                                                        `${new Intl.NumberFormat('vi-VN').format(item?.discount_amount)}% ` :
                                                        `${new Intl.NumberFormat('vi-VN').format(Math.round(item?.discount_amount))}đ `
                                                    }cho {item.promotion_type === "product" ? "sản phẩm" : "phí giao hàng"}</li>
                                                    <li style={{ whiteSpace: 'pre-line' }}>{item.description}</li>
                                                    <li>Nhóm {item.promotion_type === "product" ? "sản phẩm" : "phí giao hàng"}</li>
                                                    {item.min_order_value !== null ? (<li>Đơn hàng tối thiểu: {new Intl.NumberFormat('vi-VN').format(Math.round(item.min_order_value))}đ</li>) : ""}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[20px] m-[10px]">
                                        <input
                                            value={item.id}
                                            onChange={() => handleClickPromotion(item)}
                                            type="checkbox"
                                            checked={promotion.some((promo: any) => promo.id === item.id)}
                                            disabled={isDisabled}
                                        />
                                    </div>
                                </div>
                            );
                        }) :
                    <div className='w-[100%] flex items-center justify-center py-[130px]'>
                        <div className="">
                            <div className="flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="52" viewBox="0 0 62 52" fill="none"> <g clip-path="url(#icon-recently)"> <path opacity="0.05" d="M52.4481 14.5268L30.9814 23.5046L9.50586 14.5268L30.9814 5.53125L52.4481 14.5268Z" fill="black" fill-opacity="0.5" stroke="#231815" stroke-width="1.09333" stroke-linejoin="round"></path> <path d="M52.4668 15.2886C52.3691 15.2886 52.2624 15.2709 52.1735 15.2264L30.7068 6.23974C30.4313 6.12419 30.2535 5.86641 30.2357 5.56419C30.2179 5.27086 30.3779 4.98641 30.6446 4.85308L37.8179 1.05752C38.0135 0.950855 38.2535 0.941966 38.4579 1.02197L59.5246 9.45752C59.7913 9.56419 59.9779 9.81308 60.0046 10.0975C60.0313 10.382 59.8979 10.6575 59.6579 10.8175L52.8846 15.1642C52.7602 15.2442 52.6179 15.2886 52.4668 15.2886ZM32.7868 5.44863L52.3868 13.662L57.5779 10.3286L38.2179 2.57752L32.7868 5.44863Z" fill="#D0D0D0"></path> <path d="M9.507 15.2921C9.37367 15.2921 9.24923 15.2566 9.13367 15.1944L1.40034 10.8477C1.14256 10.7055 0.991447 10.421 1.00923 10.1277C1.027 9.83435 1.21367 9.57657 1.48923 9.46991L22.4759 0.945464C22.6714 0.865464 22.8937 0.874353 23.0892 0.963241L31.3026 4.8388C31.5781 4.97213 31.747 5.24769 31.7381 5.54991C31.7381 5.85213 31.5514 6.1188 31.267 6.24324L9.80923 15.2388C9.71145 15.2744 9.61367 15.301 9.51589 15.301L9.507 15.2921ZM3.54256 10.2966L9.56034 13.6832L29.0892 5.49657L22.7337 2.49213L3.54256 10.2966Z" fill="#D0D0D0"></path> <path d="M30.4316 23.0041C30.5028 22.9241 30.5916 22.853 30.6983 22.8086C30.5916 22.853 30.5028 22.9241 30.4316 23.0041Z" fill="#D0D0D0"></path> <path d="M52.8841 13.8839C52.8841 13.8839 52.8663 13.8839 52.8574 13.875C52.8752 13.8839 52.893 13.9017 52.9108 13.9106C52.9019 13.9106 52.9019 13.8928 52.8841 13.8839Z" fill="#D0D0D0"></path> <path d="M30.2617 23.3352C30.2884 23.2286 30.3328 23.1308 30.3951 23.0508C30.3328 23.1397 30.2884 23.2286 30.2617 23.3352Z" fill="#D0D0D0"></path> <path d="M52.1641 13.8229C52.2707 13.7784 52.3863 13.7695 52.5018 13.7695C52.3863 13.7695 52.2707 13.7695 52.1641 13.8229Z" fill="#D0D0D0"></path> <path d="M30.3945 23.0484C30.3945 23.0484 30.4212 23.0217 30.439 23.0039C30.4212 23.0217 30.4123 23.0306 30.3945 23.0484Z" fill="#D0D0D0"></path> <path d="M30.2441 23.3615C30.2441 23.3615 30.2441 23.3882 30.2441 23.406C30.2441 23.3882 30.2441 23.3615 30.253 23.3438C30.253 23.3526 30.2441 23.3615 30.2441 23.3704V23.3615Z" fill="#D0D0D0"></path> <path d="M52.5547 13.7695C52.6614 13.7784 52.7591 13.8229 52.8569 13.8762C52.7591 13.8229 52.6614 13.7784 52.5547 13.7695Z" fill="#D0D0D0"></path> <path d="M60.9377 21.1829L52.9821 13.9562C52.9821 13.9562 52.9377 13.9295 52.911 13.9118C52.8932 13.9029 52.8755 13.8851 52.8577 13.8762C52.7599 13.8229 52.6621 13.7784 52.5555 13.7695C52.5377 13.7695 52.5199 13.7695 52.5021 13.7695C52.3866 13.7695 52.271 13.7695 52.1643 13.8229L30.6977 22.8006C30.591 22.8451 30.5021 22.9162 30.431 22.9962C30.4132 23.014 30.4043 23.0229 30.3866 23.0406C30.3243 23.1206 30.2799 23.2184 30.2532 23.3251C30.2532 23.3429 30.2532 23.3695 30.2443 23.3873C30.2443 23.4229 30.2266 23.4584 30.2266 23.494V50.7206C30.2266 50.9784 30.3599 51.2273 30.5821 51.3695C30.7066 51.4495 30.8488 51.494 30.991 51.494C31.0977 51.494 31.2132 51.4673 31.311 51.4229L52.7777 41.4762C53.0443 41.3518 53.2221 41.0762 53.2221 40.7829V25.6095L60.7066 22.454C60.9466 22.3562 61.1243 22.134 61.1688 21.8762C61.2132 21.6184 61.1243 21.3518 60.9288 21.1829H60.9377ZM51.7021 40.294L31.7732 49.5295V25.3695L37.9243 31.5473C38.0755 31.6984 38.271 31.7695 38.4666 31.7695C38.5643 31.7695 38.671 31.7518 38.7599 31.7073L51.7021 26.2584V40.3029V40.294ZM53.231 23.9473L51.7021 24.5962L38.6443 30.0984L32.351 23.7784L51.7021 15.6806L52.3155 15.4229L53.2399 16.2584L59.0266 21.5118L53.2399 23.9473H53.231Z" fill="#D0D0D0"></path> </g> <defs> <clipPath id="icon-recently"> <rect width="60.4089" height="50.6133" fill="white" transform="translate(0.777344 0.890625)"></rect> </clipPath> </defs> </svg>
                            </div>
                            <span className='font-[500] text-[14px] text-[#BCBCBC] my-[24px]'>Hiện không có mã giảm giá nào.</span>
                        </div>
                    </div>}
                </div>
                <button onClick={() => handleSubmitVoucher()} className={`${promotions?.data.length == 0 ? "bg-[#787878] pointer-events-none" : "bg-black cursor-pointer"} absolute w-[100%] flex justify-center items-center p-[15px]  text-white font-[600] text-[14px]`}>
                    Áp dụng {promotion.length > 0 && `(${promotion.length})`}
                </button>
            </div>
            <div onClick={() => setPromotion(false)} className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
        </div>
    )
}

export default Promotions;