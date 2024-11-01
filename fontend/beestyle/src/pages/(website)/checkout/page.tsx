import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AddAddresses from './_components/addAddresses';
import CheckAddresses from './_components/checkAddresses';


type Props = {}

const CheckOutPage = (props: Props) => {
    const [todos, setTodos] = useState<boolean>(false)
    const [isAddAddresses, setAddAddresses] = useState<boolean>(false)
    const [isCheckAddresses, setCheckAddresses] = useState<boolean>(false)

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);


    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Lấy dữ liệu từ giỏ hàng sang
    const location = useLocation();
    const checkouts = location.state || { selectedItems: [] };

    return (
        <main>
            <div className="px-[15px] lg:flex pc:px-[80px] pc:py-[64px]">

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
                                {checkouts.products.map((item: any, index: any) => (
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
                                <div className="flex justify-start items-center mb-[8px]">
                                    <svg className='mr-[8px]' width="21" height="18" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="none" clipRule="none" d="M17.3337 5.3335V2.00016C17.3337 1.07516 16.5837 0.333496 15.667 0.333496H2.33366C1.41699 0.333496 0.675326 1.07516 0.675326 2.00016V5.3335C1.59199 5.3335 2.33366 6.0835 2.33366 7.00016C2.33366 7.91683 1.59199 8.66683 0.666992 8.66683V12.0002C0.666992 12.9168 1.41699 13.6668 2.33366 13.6668H15.667C16.5837 13.6668 17.3337 12.9168 17.3337 12.0002V8.66683C16.417 8.66683 15.667 7.91683 15.667 7.00016C15.667 6.0835 16.417 5.3335 17.3337 5.3335ZM15.667 4.11683C14.6753 4.69183 14.0003 5.77516 14.0003 7.00016C14.0003 8.22516 14.6753 9.3085 15.667 9.8835V12.0002H2.33366V9.8835C3.32533 9.3085 4.00033 8.22516 4.00033 7.00016C4.00033 5.76683 3.33366 4.69183 2.34199 4.11683L2.33366 2.00016H15.667V4.11683ZM9.83366 9.50016H8.16699V11.1668H9.83366V9.50016ZM8.16699 6.16683H9.83366V7.8335H8.16699V6.16683ZM9.83366 2.8335H8.16699V4.50016H9.83366V2.8335Z" fill="#2E2E2E"></path>
                                    </svg>
                                    <span>Xem thêm mã giảm giá</span>
                                </div>
                                <div className="">
                                    <span className='text-[12px] leading-3 bg-[#f9e076] py-[5px] px-[10px] rounded-[4px] border-[1px] border-black'>
                                        <span>Giảm 5%</span>
                                    </span>
                                </div>
                            </div>


                            <div className="">
                                <div className="*:text-[14px] mb-[32px]">
                                    <div className="flex justify-between *:font-[700]">
                                        <h3>Tạm tính</h3>
                                        <span>{new Intl.NumberFormat('vi-VN').format(checkouts?.totalPrice) || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển</span>
                                        <span>30.000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Giảm giá</span>
                                        <span>0</span>
                                    </div>
                                </div>

                                <div className="flex justify-between *:font-[700]">
                                    <h2>TỔNG CỘNG</h2>
                                    <span>{new Intl.NumberFormat('vi-VN').format(totalAmount) || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-[65%] lg:pr-[80px] lg:order-1">
                    <form action="">
                        <h2 className='font-[700] text-[16px] mb-[10px]'>THÔNG TIN GIAO HÀNG</h2>

                        <div className="border-b-[1px] border-b-[#787878] mb-[30px]">
                            <div
                                style={{
                                    backgroundImage: "repeating-linear-gradient(45deg, #000000, #6fa6d6 33px, transparent 0, transparent 41px, #000000 0, #f18d9b 74px, transparent 0, transparent 82px)",
                                    backgroundPositionX: "-30px",
                                    backgroundSize: "116px 3px",
                                    height: "3px",
                                    width: "100%"
                                }}
                            ></div>
                            <div className="flex justify-between items-center p-[20px_15px]">
                                <div className="mr-[20px]">
                                    <div className="flex mb-[10px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        <span className='text-[18px] ml-[5px]'>Địa chỉ nhận hàng</span>
                                    </div>
                                    <div className="text-[18px] font-[600]">
                                        <span className='mr-[20px]'>Lê Hoàng Anh</span>
                                        <span>0334342232</span>
                                    </div>
                                    <div className="tex-[16px]">
                                        Q Lộ 91, Thị Trấn Vĩnh Thạnh Trung, Huyện Châu Phú, An Giang
                                    </div>
                                </div>
                                <div onClick={() => setCheckAddresses(!isCheckAddresses)} className="text-[16px] font-[500] w-[100px] cursor-pointer">Thay đổi</div>
                            </div>

                        </div>

                        <div className="">
                            <label className='text-[16px] font-[500] mb-[5px]'>Ghi chú</label>
                            <textarea placeholder="Nhập ghi chú của bạn tại đây..." name="" id="" className='w-[100%] outline-none borde-[#787878] border-[1px] rounded-[5px] p-[10px]'></textarea>
                        </div>

                        <div className="mt-[15px]">
                            <h2 className='font-[700] text-[16px] mb-[5px]'>PHƯƠNG THỨC THANH TOÁN</h2>
                            <div className="">
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            // {...register("paymentMethod", { required: true })}
                                            className='hidden'
                                            type="radio"
                                            id='payment-vnpay'
                                            value="VNPay"
                                        />
                                        {/* {errors.paymentMethod && (<span className='italic text-red-500 text-[12px]'>{errors.paymentMethod?.message}</span>)} */}
                                        <label htmlFor="payment-vnpay" className={`relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className={`w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white`}></div>
                                        </label>
                                    </div>
                                    <img src="https://file.hstatic.net/1000284478/file/vnpay-40_5dbcecd2b4eb4245a4527d357a0459fc.svg" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng </span>
                                </div>
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            // {...register("paymentMethod", { required: true })}
                                            className='hidden'
                                            type="radio"
                                            id='payment-paypal'
                                            value="paypal"
                                        />
                                        <label htmlFor="payment-paypal" className={`relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className={` w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white`}></div>
                                        </label>
                                    </div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng Paypal</span>
                                </div>
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            // {...register("paymentMethod", { required: true })}
                                            className='hidden'
                                            type="radio"
                                            id='payment-cod'
                                            value="cod"
                                        />
                                        <label htmlFor="payment-cod" className={`relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className={`w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white`}></div>
                                        </label>
                                    </div>
                                    <img src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2022/11/ship-cod-la-gi-0.jpg" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng tiền mặt</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex fixed bottom-0 left-0 w-[100%] justify-center lg:py-[32px] bg-[#F0F0F0] *:w-[50%] *:flex *:justify-center *:py-[18px] *:font-[600] *:text-[16px] lg:h-[126px] *:lg:w-[330px] *:lg:items-center ">
                            <Link to={`/carts`} className="bg-white lg:mr-[25px]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke="#2E2E2E" strokeLinecap="round" strokeLinejoin="round"></path> </svg>
                                QUAY LẠI GIỎ HÀNG</Link>
                            <button type='submit' className="bg-black text-white">HOÀN TẤT ĐƠN HÀNG</button>
                        </div>
                    </form>

                    <CheckAddresses isCheckAddresses={isCheckAddresses} isAddAddresses={isAddAddresses} setCheckAddresses={setCheckAddresses} setAddAddresses={setAddAddresses} />
                    <AddAddresses isCheckAddresses={isCheckAddresses} isAddAddresses={isAddAddresses} setCheckAddresses={setCheckAddresses} setAddAddresses={setAddAddresses} />

                </div >

                <div className={`hidden fixed z-10 flex-col top-0`}>
                    <div className="fixed overflow-hidden bg-white z-20 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] max-w-[500px] max-h-[500px] w-[100%]">
                        <div className="absolute right-0 cursor-pointer p-[5px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="flex w-[100%] justify-center p-[24px]">CHỌN GIẢM GIÁ</div>
                        <div className="p-[16px_32px] pt-[0]">
                            <div className="border-[1px] border-[##f0f0f0]">
                                <div className="flex p-[16px] pb-[8px] items-center">
                                    <div className="mr-[10px] w-[37px]">
                                        <svg width="37" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M28.4325 45.5026C27.418 45.5026 26.5115 44.7611 25.631 44.0411C25.093 43.6006 24.3555 42.9976 23.9995 42.9976C23.644 42.9976 22.9065 43.6006 22.3685 44.0411C21.404 44.8296 20.31 45.7261 19.1055 45.4501C17.8625 45.1676 17.254 43.8606 16.717 42.7081C16.449 42.1316 16.043 41.2601 15.7545 41.1206C15.4485 40.9711 14.4985 41.2016 13.87 41.3526C12.6465 41.6471 11.2605 41.9791 10.2805 41.1976C9.297 40.4121 9.3145 38.9816 9.331 37.7201C9.339 37.0766 9.351 36.1046 9.144 35.8446C8.9395 35.5886 7.993 35.3861 7.3665 35.2521C6.1275 34.9871 4.7245 34.6866 4.1745 33.5466C3.6325 32.4241 4.265 31.1511 4.822 30.0281C5.1115 29.4461 5.5485 28.5656 5.472 28.2281C5.403 27.9256 4.65 27.3411 4.152 26.9541C3.1435 26.1721 2 25.2841 2 24.0001C2 22.7161 3.1435 21.8286 4.1525 21.0456C4.6505 20.6591 5.4035 20.0746 5.4725 19.7716C5.549 19.4341 5.112 18.5536 4.823 17.9711C4.2655 16.8481 3.6335 15.5756 4.176 14.4521C4.726 13.3126 6.129 13.0121 7.3675 12.7471C7.994 12.6131 8.9405 12.4106 9.1445 12.1551C9.3525 11.8946 9.3405 10.9221 9.3325 10.2786C9.3165 9.01706 9.299 7.58706 10.282 6.80156C11.2615 6.01956 12.6485 6.35256 13.8715 6.64656C14.501 6.79756 15.45 7.02606 15.7555 6.87906C16.0445 6.73956 16.45 5.86856 16.7185 5.29156C17.255 4.13856 17.863 2.83206 19.106 2.54956C20.309 2.27656 21.405 3.16956 22.369 3.95856C22.9075 4.39906 23.645 5.00206 24.0005 5.00206C24.356 5.00206 25.0935 4.39906 25.6315 3.95906C26.5965 3.16956 27.69 2.27456 28.895 2.54956C30.1375 2.83206 30.746 4.13906 31.283 5.29206C31.5515 5.86856 31.957 6.74006 32.246 6.87956C32.5525 7.02706 33.501 6.79806 34.1295 6.64706C35.353 6.35306 36.7395 6.02006 37.7195 6.80206C38.703 7.58756 38.6855 9.01756 38.669 10.2796C38.661 10.9231 38.649 11.8956 38.856 12.1551C39.0605 12.4106 40.007 12.6136 40.6335 12.7476C41.8725 13.0126 43.2755 13.3126 43.8255 14.4526C44.3675 15.5756 43.735 16.8486 43.178 17.9716C42.8885 18.5541 42.4515 19.4341 42.528 19.7716C42.597 20.0746 43.35 20.6591 43.848 21.0456C44.8565 21.8286 46 22.7161 46 24.0001C46 25.2841 44.8565 26.1716 43.8475 26.9546C43.3495 27.3411 42.5965 27.9251 42.5275 28.2291C42.451 28.5666 42.888 29.4466 43.177 30.0291C43.7345 31.1521 44.3665 32.4246 43.824 33.5481C43.274 34.6876 41.871 34.9881 40.6325 35.2526C40.006 35.3871 39.0595 35.5896 38.855 35.8451C38.6475 36.1056 38.6595 37.0781 38.6675 37.7216C38.6835 38.9826 38.701 40.4126 37.718 41.1981C36.7385 41.9801 35.3515 41.6466 34.1285 41.3531C33.499 41.2021 32.55 40.9726 32.2445 41.1211C31.9555 41.2601 31.55 42.1316 31.2815 42.7081C30.745 43.8616 30.137 45.1681 28.894 45.4506C28.738 45.4861 28.584 45.5026 28.4325 45.5026ZM15.445 39.0751C15.8595 39.0751 16.257 39.1421 16.6235 39.3186C17.555 39.7676 18.051 40.8331 18.5305 41.8636C18.768 42.3736 19.262 43.4346 19.5485 43.4996C19.815 43.5466 20.685 42.8331 21.102 42.4921C22.001 41.7571 22.93 40.9971 23.9995 40.9971C25.069 40.9971 25.9985 41.7576 26.897 42.4921C27.314 42.8331 28.158 43.5326 28.4515 43.4996C28.737 43.4341 29.2315 42.3736 29.4685 41.8636C29.9475 40.8331 30.4435 39.7686 31.3755 39.3186C32.3235 38.8611 33.4775 39.1396 34.595 39.4081C35.1325 39.5371 36.253 39.8066 36.469 39.6346C36.6885 39.4596 36.674 38.3021 36.667 37.7461C36.6525 36.6001 36.6375 35.4156 37.2915 34.5966C37.9415 33.7826 39.096 33.5356 40.213 33.2966C40.76 33.1796 41.8975 32.9361 42.022 32.6786C42.138 32.4371 41.629 31.4111 41.3845 30.9181C40.872 29.8856 40.3415 28.8176 40.5765 27.7856C40.804 26.7846 41.7275 26.0676 42.62 25.3746C43.103 25.0006 44 24.3046 44 24.0001C44 23.6956 43.103 22.9996 42.621 22.6251C41.728 21.9321 40.8045 21.2156 40.577 20.2141C40.3425 19.1821 40.873 18.1141 41.3855 17.0816C41.63 16.5886 42.1395 15.5631 42.023 15.3211C41.8985 15.0631 40.761 14.8201 40.2145 14.7031C39.0975 14.4641 37.9425 14.2171 37.2925 13.4036C36.639 12.5851 36.654 11.4001 36.6685 10.2546C36.6755 9.69856 36.69 8.54056 36.4705 8.36556C36.2555 8.19356 35.1345 8.46306 34.596 8.59206C33.479 8.86056 32.325 9.13856 31.3765 8.68106C30.445 8.23156 29.949 7.16656 29.4695 6.13656C29.232 5.62656 28.7385 4.56556 28.4515 4.50056C28.1765 4.45306 27.3145 5.16706 26.8975 5.50756C25.999 6.24306 25.07 7.00306 24.0005 7.00306C22.931 7.00306 22.002 6.24256 21.103 5.50756C20.686 5.16656 19.816 4.45606 19.5485 4.50006C19.2625 4.56506 18.768 5.62606 18.531 6.13606C18.0515 7.16606 17.556 8.23106 16.6245 8.68056C15.6765 9.13756 14.5225 8.86056 13.4045 8.59156C12.867 8.46206 11.7455 8.19306 11.5305 8.36456C11.311 8.54006 11.3255 9.69756 11.3325 10.2536C11.347 11.3996 11.362 12.5846 10.708 13.4026C10.058 14.2166 8.9035 14.4636 7.7865 14.7026C7.2395 14.8196 6.102 15.0631 5.9775 15.3206C5.8615 15.5621 6.3705 16.5881 6.615 17.0811C7.1275 18.1136 7.658 19.1816 7.423 20.2136C7.1955 21.2146 6.272 21.9316 5.3795 22.6246C4.897 22.9996 4 23.6956 4 24.0001C4 24.3046 4.897 25.0011 5.379 25.3751C6.272 26.0681 7.1955 26.7841 7.423 27.7856C7.6575 28.8176 7.127 29.8851 6.6145 30.9181C6.37 31.4111 5.8605 32.4366 5.977 32.6786C6.1015 32.9371 7.239 33.1801 7.786 33.2971C8.9025 33.5361 10.0575 33.7831 10.7075 34.5971C11.361 35.4156 11.346 36.6001 11.3315 37.7461C11.3245 38.3021 11.31 39.4601 11.5295 39.6351C11.7445 39.8046 12.8655 39.5376 13.404 39.4081C14.0885 39.2431 14.788 39.0751 15.445 39.0751Z" fill="#F47560"></path>
                                            <path d="M18.207 32.207L32.207 18.207C32.5975 17.8165 32.5975 17.1835 32.207 16.793C31.8165 16.4025 31.1835 16.4025 30.793 16.793L16.793 30.793C16.4025 31.1835 16.4025 31.8165 16.793 32.207C16.9885 32.4025 17.244 32.5 17.5 32.5C17.756 32.5 18.0115 32.4025 18.207 32.207ZM19.5 23C17.5705 23 16 21.43 16 19.5C16 17.57 17.5705 16 19.5 16C21.4295 16 23 17.57 23 19.5C23 21.43 21.4295 23 19.5 23ZM19.5 18C18.673 18 18 18.673 18 19.5C18 20.327 18.673 21 19.5 21C20.327 21 21 20.327 21 19.5C21 18.673 20.327 18 19.5 18ZM29.5 33C27.5705 33 26 31.4295 26 29.5C26 27.5705 27.5705 26 29.5 26C31.4295 26 33 27.5705 33 29.5C33 31.4295 31.4295 33 29.5 33ZM29.5 28C28.673 28 28 28.673 28 29.5C28 30.327 28.673 31 29.5 31C30.327 31 31 30.327 31 29.5C31 28.673 30.327 28 29.5 28Z" fill="#F47560"></path>
                                        </svg>
                                    </div>
                                    <div className="flex justify-center">
                                        <span className='text-[16px] font-[700]'>BEESTYLE WELLCOME</span>
                                        {/* <p>Xem chi tiết</p> */}
                                    </div>
                                </div>
                                <div className="px-[16px]">
                                    <ul className='text-[14px]'>
                                        <li><a href="">Giảm 5% sản phẩm</a></li>
                                        <li><a href="">Nhóm khách hàng được chỉ định</a></li>
                                        <li><a href="">Nhóm sản phẩm</a></li>
                                        <li><a href="">Hàng mới về</a></li>
                                    </ul>
                                </div>
                                <div className="mt-[16px] flex justify-center items-center p-[10px] bg-black text-white font-[600] text-[14px]">
                                    Áp dụng
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
                </div>

            </div >
        </main >
    )
}

export default CheckOutPage