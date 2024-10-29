import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import ErrorPage from '../404/page';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Props = {}

const CheckOutPage = (props: Props) => {
    const [todos, setTodos] = useState<boolean>(false)
    const [address, setAddress] = useState<any>();
    const [resultsId, setResultsId] = useState<any>();
    const [districtId, setDistrictId] = useState<any>();
    const [wardsId, setWardsId] = useState<any>();


    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [provinceName, setProvinceName] = useState();
    const [districtName, setDistrictName] = useState();
    const [wardsName, setWardsName] = useState();

    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Lấy dữ liệu từ giỏ hàng sang
    const location = useLocation();
    const checkouts = location.state || { selectedItems: [] };

    
    useEffect(() => {
        setTotalPrice(checkouts.totalPrice)
        setTotalAmount(checkouts.totalPrice + 30000)
    }, [checkouts.totalPrice])


    const token = localStorage.getItem('accessToken');

    // Lấy tất cả sản phẩm theo id người dùng
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            return axios.get(`http://localhost:8080/api/user`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Truyền token vào header
                },
            })
        }
    })
    // Tạo state để lưu giá trị của input
    const [userName, setUserName] = useState(user?.data?.user?.name || '');

    


    // Cập nhật userName khi dữ liệu người dùng được lấy xong
    useEffect(() => {
        if (user?.data?.user?.name) {
            setUserName(user.data.user.name);
        }
    }, [user]);

    const [phoneNumber, setPhoneNumber] = useState('');

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value); // Update state with the input value
    };
    // Hàm xử lý khi người dùng nhập giá trị vào ô input
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };
    const handleResults = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newResultsId = e.target.value;
        const selectedProvince = results?.data.results.find((item: any) => item.province_id === newResultsId);
        if (selectedProvince) {
            setProvinceName(selectedProvince.province_name); // Set the province name
        }
        setResultsId(newResultsId);
        setDistrictId(undefined);
        setWardsId(undefined);
    };
    const handleDistricts = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDistrictId = e.target.value;
        const selectedDistrict = district?.data.results.find((item: any) => item.district_id === newDistrictId);
        if (selectedDistrict) {
            setDistrictName(selectedDistrict.district_name);
        }
        setDistrictId(newDistrictId);
        setWardsId(undefined);
    };
    const handleWards = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newWardsId = e.target.value;
        const selectedWards = ward?.data.results.find((item: any) => item.ward_id === newWardsId);
        if (selectedWards) {
            setWardsName(selectedWards.ward_name);
        }
        setWardsId(newWardsId);
    };


    // Query lấy các tỉnh thành
    const { data: results } = useQuery({
        queryKey: ['results'],
        queryFn: async () => {
            return await axios.get('https://vapi.vnappmob.com/api/province/');

        }
    });

    // Query lấy các quận huyện
    const { data: district } = useQuery({
        queryKey: ['district', resultsId],
        queryFn: async () => {
            if (!resultsId) {
                return;
            }
            return await axios.get(`https://vapi.vnappmob.com/api/province/district/${resultsId}`);

        },
        enabled: !!resultsId
    });

    // Query lấy các phường xã
    const { data: ward } = useQuery({
        queryKey: ['ward', districtId],
        queryFn: async () => {
            if (!districtId) {
                return;
            }
            return await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtId}`);

        },
        enabled: !!resultsId
    });


    const [selectedOption, setSelectedOption] = useState("1");

    const handleCheckboxChange = (value: any) => {
        setSelectedOption(value);
    };




    // const {mutate} = useMutation({
    //     mutationFn: async (oder: any) => {
            
    //         try {
    //             const {data} = await axios.post(`http://localhost:8080/api/zalopay` , oder ,{
    //                 headers: {
    //                     Authorization: `Bearer ${token}`, // Truyền token vào header
    //                 },
    //             })
    //             if(data.return_code === 1) {
    //                 const paymentUrl = data.order_url
    //                 window.location.href = paymentUrl;
    //             }
    //         } catch (error) {
    //             throw new Error("Thao tác bị gián đoạn, xin vui lòng thử lại")
    //         }
    //     }
    // })

    // const HandleSubmit = () => {
    //     const orderItems = checkouts.products
        
    //     const customer = {userName, phoneNumber, map: {address, provinceName, districtName, wardsName}}

    //     mutate({customer, orderItems ,totalAmount})
    // }

    // if (checkouts?.selectedItems?.length <= 0) return <ErrorPage />

    return (
        <main>
            <div className="px-[15px] lg:flex pc:px-[80px] pc:py-[64px]">

                <div className="mb-[16px] lg:w-[35%] lg:order-2">
                    <button className='flex items-center justify-between w-full lg:mb-[16px]'>
                        <div onClick={() => { setTodos(!todos) }} className="flex items-center">
                            <span className="text-[16px] font-[700]">TÓM TẮT ĐƠN HÀNG</span>
                            <svg className={`${todos ? "hidden" : ""} ml-[4px]`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"></path> </svg>
                            <svg className={`${todos ? "" : "hidden"} ml-[4px]`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)">
                                <path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>

                        </div>
                        <span className="text-[20px] font-[700]">{checkouts.totalPrice ? new Intl.NumberFormat('vi-VN').format(checkouts.totalPrice) : 0}</span>
                    </button>
                    <div className="bg-[#f7f7f7] -mx-[16px] lg:mx-0">
                        <div className="w-[100%] p-[16px]">
                            <div className={`${todos ? "hidden" : ""}`}>
                                {/* {checkouts.products.map((item: any) => (
                                    <div className="mb-[16px]">
                                        <div className='w-[100%] flex justify-between'>
                                            <div className='w-[100px] h-[100px]'>
                                                <div className="pt-[100%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${item.images[0]}')`, }}></div>
                                            </div>

                                            <div className="w-full pl-[12px] flex flex-col">
                                                <div className="leading-5">
                                                    <b className='text-[16px]'>MLB</b><br />
                                                    <span className='text-[14px] mb-[4px]'>{item.name}</span>
                                                </div>
                                                <span className='text-[12px] mb-[4px]'>50CRS / {item.size} / {item.slug}</span>
                                                <div className="text-[14px] *:font-[700] flex justify-between mt-[8px]">
                                                    <span className=''>{new Intl.NumberFormat('vi-VN').format(item.price - (item.price * item.discount / 100)) || 0}<span>VND</span></span>
                                                    <span className=''>Số lượng: {item.quantity}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))} */}
                            </div>

                            <div className="pb-[16px]">
                                <div className="flex justify-between">
                                    <div className="w-[100%]">
                                        <span className='mb-[8px] text-[12px] font-[600] text-[#808080] tracking-widest'>MÃ GIẢM GIÁ</span>
                                        <div className="mt-[8px] flex justify-between w-[100%] border-[1px] border-[#808080] leading-3 rounded-[3.5px]">
                                            <input className='rounded-[3.5px] text-[12px] w-[calc(100%-100px)] p-[13px]' type="text" placeholder='Nhap Ma Giam Gia' />
                                            <button className='rounded-r-[3.5px] text-[12px] font-[700] justify-center tracking-widest bg-black text-white items-center px-[20px] w-[124.47px] flex'>SỬ DỤNG</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-[8px] pb-[16px] mb-[16px] flex flex-col">
                                <div className="flex justify-start items-center mb-[8px]">
                                    <svg className='mr-[8px]' width="21" height="18" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="none" clip-rule="none" d="M17.3337 5.3335V2.00016C17.3337 1.07516 16.5837 0.333496 15.667 0.333496H2.33366C1.41699 0.333496 0.675326 1.07516 0.675326 2.00016V5.3335C1.59199 5.3335 2.33366 6.0835 2.33366 7.00016C2.33366 7.91683 1.59199 8.66683 0.666992 8.66683V12.0002C0.666992 12.9168 1.41699 13.6668 2.33366 13.6668H15.667C16.5837 13.6668 17.3337 12.9168 17.3337 12.0002V8.66683C16.417 8.66683 15.667 7.91683 15.667 7.00016C15.667 6.0835 16.417 5.3335 17.3337 5.3335ZM15.667 4.11683C14.6753 4.69183 14.0003 5.77516 14.0003 7.00016C14.0003 8.22516 14.6753 9.3085 15.667 9.8835V12.0002H2.33366V9.8835C3.32533 9.3085 4.00033 8.22516 4.00033 7.00016C4.00033 5.76683 3.33366 4.69183 2.34199 4.11683L2.33366 2.00016H15.667V4.11683ZM9.83366 9.50016H8.16699V11.1668H9.83366V9.50016ZM8.16699 6.16683H9.83366V7.8335H8.16699V6.16683ZM9.83366 2.8335H8.16699V4.50016H9.83366V2.8335Z" fill="#2E2E2E"></path>
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
                                        <span>{new Intl.NumberFormat('vi-VN').format(totalPrice) || 0}</span>
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
                    <h2 className='font-[700] text-[16px] tr'>THÔNG TIN GIAO HÀNG</h2>
                    <div className="lg:flex lg:flex-wrap lg:justify-between">

                        <div className="my-[16px] flex items-center justify-start">
                            <div className="mr-[16px] rounded-[100%] w-[80px] h-[80px] overflow-hidden">
                                <img width={80} height={80} src="https://picsum.photos/80" alt="" />
                            </div>
                            <div className="">
                                <h2 className='text-[16px] font-[700]'>{user?.data?.user.name}</h2>
                                <span className='text-[14px]'>{(user?.data?.user.email)}</span>
                            </div>
                        </div>


                        <div className="mt-[10px] lg:w-[100%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>CHỌN ĐỊA CHỈ</label>
                            <select className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px] lin' name="" id="" value="">
                                <option value="" disabled>-- Địa chỉ đã lưu trữ --</option>
                            </select>
                        </div>
                        <div className="mt-[10px] lg:w-[48%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>HỌ VÀ TÊN</label>
                            <input className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[8px]' type="text" placeholder='Nhập Họ và Tên' value={userName} onChange={handleChange} />
                        </div>
                        <div className="mt-[10px] lg:w-[48%]">
                            <label htmlFor="phone" className='text-[#868D95] font-[600] text-[13px]'>
                                SỐ ĐIỆN THOẠI
                            </label>
                            <input
                                className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[8px]'
                                type="text"
                                placeholder='Nhập số điện thoại'
                                value={phoneNumber} // Bind input value to state
                                onChange={handleInputChange} // Update state on input change
                            />
                        </div>
                    </div>

                    <div className="flex mt-[15px] py-[8px]">

                        <div className="flex items-center w-[50%]">
                            <input
                                className='hidden'
                                type="checkbox"
                                id='checkbox'
                                name="options"
                                value="1"
                                checked={selectedOption === "1"}
                                onChange={() => handleCheckboxChange("1")}
                            />
                            <label htmlFor="checkbox" className={`after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                <div className={`w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white ${selectedOption === "1" ? 'bg-black' : 'bg-transparent'}`}></div>
                            </label>
                            <span className='ml-[5px]'>Giao tận nơi</span>
                        </div>

                        <div className="flex items-center w-[50%] pl-[16px]">
                            <input
                                className='hidden'
                                type="checkbox"
                                id='checkbox1'
                                name="options1"
                                value="2"
                                checked={selectedOption === "2"}
                                onChange={() => handleCheckboxChange("2")}
                            />
                            <label htmlFor="checkbox1" className={` only:after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                <div className={`w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white ${selectedOption === "2" ? 'bg-black' : 'bg-transparent'}`}></div>
                            </label>
                            <span className='ml-[5px]'>Nhận tại cửa hàng</span>
                        </div>

                    </div>

                    <div className={`${selectedOption === "2" ? "hidden lg:hidden" : ""} lg:flex lg:flex-wrap lg:justify-between`}>

                        <div className="mt-[10px] lg:w-[48%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>ĐỊA CHỈ</label>
                            <input
                                className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[8px]'
                                type="text"
                                placeholder='Nhập địa chỉ'
                                value={address}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="mt-[10px] lg:w-[48%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>TỈNH / THÀNH</label>
                            <select onChange={handleResults} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]' name="" id="" value={resultsId || ''}>
                                <option value="" disabled>-- Chọn Tỉnh / Thành --</option>
                                {results?.data.results.map((item: any) => (
                                    <option key={item.province_id} value={item.province_id}>{item.province_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-[10px] lg:w-[48%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>QUẬN / HUYỆN</label>
                            <select onChange={handleDistricts} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]' name="" id="" value={districtId || ''}>
                                <option value="" disabled>-- Chọn Quận / Huyện --</option>
                                {district?.data.results.map((item: any) => (
                                    <option key={item.district_id} value={item.district_id}>{item.district_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-[10px] lg:w-[48%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>PHƯỜNG / XÃ</label>
                            <select onChange={handleWards} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]' name="" id="" value={wardsId || ''}>
                                <option value="" disabled>-- Chọn Phường / Xã --</option>
                                {ward?.data.results.map((item: any) => (
                                    <option key={item.ward_id} value={item.ward_id}>{item.ward_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={`${selectedOption === "1" ? "hidden lg:hidden" : ""} lg:flex lg:flex-wrap lg:justify-between`}>
                        <div className="mt-[10px] lg:w-[100%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>TỈNH / THÀNH</label>
                            <select className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]' name="" id="" value="">
                                <option value="" disabled>-- Chọn Tỉnh / Thành --</option>
                                <option value="">Hà Nội</option>
                                <option value="">Hồ Chí Minh</option>
                                <option value="">Đằ Nẵng</option>
                            </select>
                        </div>
                        <div className="mt-[10px] lg:w-[100%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>QUẬN / HUYỆN</label>
                            <select className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]' name="" id="" value="">
                                <option value="" disabled>-- Chọn Quận / Huyện --</option>
                                <option value="">Hà Nội</option>
                                <option value="">Hồ Chí Minh</option>
                                <option value="">Đằ Nẵng</option>
                            </select>
                        </div>
                        <div className="mt-[10px] lg:w-[100%]">
                            <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>PHƯỜNG / XÃ</label>
                            <select className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]' name="" id="" value="">
                                <option value="" disabled>-- Chọn Phường / Xã --</option>
                                <option value="">Hà Nội</option>
                                <option value="">Hồ Chí Minh</option>
                                <option value="">Đằ Nẵng</option>
                            </select>
                        </div>
                    </div>

                    <div className={`${selectedOption === "2" ? "hidden" : ""} flex mt-[15px] pt-[8px]`}>
                        <div className="flex items-center">
                            <input
                                className='hidden'
                                type="radio"
                                id='checkbox'
                                name="options"
                                value="1"
                            />
                            <label htmlFor="checkbox" className={`after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                <div className="w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white bg-black"></div>
                            </label>
                            <span className='ml-[5px]'>Nhà</span>
                        </div>
                        <div className="flex items-center pl-[16px]">
                            <input
                                className='hidden'
                                type="radio"
                                id='checkbox'
                                name="options"
                                value="1"
                            />
                            <label htmlFor="checkbox" className={`after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                <div className="w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white bg-black"></div>
                            </label>
                            <span className='ml-[5px]'>Công ty</span>
                        </div>
                    </div>
                    <hr className="mt-[16px] border-dashed border-black" />

                    <div className={`${selectedOption === "1" ? "hidden" : ""} mt-[16px]`}>
                        <h2 className='font-[700] text-[16px] tr'>THÔNG TIN NHẬN HÀNG</h2>
                        <div className="flex items-center py-[8px]">
                            <input
                                className='hidden'
                                type="radio"
                                id='checkbox'
                                name="options"
                                value="1"
                            />
                            <label htmlFor="checkbox" className={`after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                <div className="w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white bg-black"></div>
                            </label>
                            <div className="ml-[9px]">
                                <span className='text-[16px] font-[600]'>(HN) - MLB Trần Duy Hưng</span>
                                <p className='text-[14px]'>L1 - 02 119Trung tâm thương mại Vincom Trần Duy Hưng, Hà Nội, Quận Cầu Giấy, Hà Nội</p>
                            </div>
                        </div>
                        <div className="flex items-center py-[8px]">
                            <input
                                className='hidden'
                                type="radio"
                                id='checkbox'
                                name="options"
                                value="1"
                            />
                            <label htmlFor="checkbox" className={`after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                <div className="w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white bg-black"></div>
                            </label>
                            <div className="ml-[9px]">
                                <span className='text-[16px] font-[600]'>(HN) - MLB Trần Duy Hưng</span>
                                <p className='text-[14px]'>L1 - 02 119Trung tâm thương mại Vincom Trần Duy Hưng, Hà Nội, Quận Cầu Giấy, Hà Nội</p>
                            </div>
                        </div>
                    </div>


                    <div className="mt-[16px]">
                        <div className={`${selectedOption === "2" ? "hidden" : ""} mb-[30px]`}>
                            <h2 className='font-[600] text-[16px] mb-[5px]'>PHƯƠNG THỨC VẬN CHUYỂN</h2>
                            <div className="flex flex-col items-center p-[20px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.4" stroke="#808080" className="size-28">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                </svg>
                                <p className='text-[14px] text-[#808080]'>Vui lòng chọn tỉnh / thành để có danh sách phương thức vận chuyển.</p>
                            </div>
                        </div>

                        <hr className='[#808080] mt-[5px]' />
                        <div className="mt-[15px]">
                            <h2 className='font-[700] text-[16px] mb-[5px]'>PHƯƠNG THỨC THANH TOÁN</h2>
                            <div className="">
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            className='hidden'
                                            type="radio"
                                            id='checkbox'
                                            name="options"
                                            value="1"
                                        />
                                        <label htmlFor="checkbox" className={`after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className="w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white bg-black"></div>
                                        </label>
                                    </div>
                                    <img src="https://file.hstatic.net/1000284478/file/atm-01_3e4ba76cfbca40f0b523f803829ae9d2.svg" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng ATM/Thẻ nội địa</span>
                                </div>
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            className='hidden'
                                            type="radio"
                                            id='checkbox'
                                            name="options"
                                            value="1"
                                        />
                                        <label htmlFor="checkbox" className={`after relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className="w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white bg-black"></div>
                                        </label>
                                    </div>
                                    <img src="https://file.hstatic.net/1000284478/file/atm-01_3e4ba76cfbca40f0b523f803829ae9d2.svg" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng ATM/Thẻ nội địa</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="flex fixed bottom-0 left-0 w-[100%] justify-center lg:py-[32px] bg-[#F0F0F0] *:w-[50%] *:flex *:justify-center *:py-[18px] *:font-[600] *:text-[16px] lg:h-[126px] *:lg:w-[330px] *:lg:items-center ">
                        <Link to={`/carts`} className="bg-white lg:mr-[25px]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke="#2E2E2E" stroke-linecap="round" stroke-linejoin="round"></path> </svg>
                            QUAY LẠI GIỎ HÀNG</Link>
                        <button className="bg-black text-white">HOÀN TẤT ĐƠN HÀNG</button>
                    </div>
                </div>




            </div>
        </main>
    )
}

export default CheckOutPage