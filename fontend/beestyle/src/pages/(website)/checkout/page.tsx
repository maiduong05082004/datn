import { useOrderMutations } from '@/components/hooks/useOrderMutations';
import { joiResolver } from '@hookform/resolvers/joi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Joi from 'joi';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import LoadingPage from '../loading/loadPage';
import AddAddresses from './_components/addAddresses';
import CheckAddresses from './_components/checkAddresses';
import ItemProducts from './_components/itemProducts';
import UpdateAddresses from './_components/updateAddresses';
interface TCheckout {
    address: any,
    note: string,
    paymentMethod: string;
}
const checkoutSchema = Joi.object({
    address: Joi.number().required(),
    note: Joi.string().max(100).allow('').messages({
        'string.max': 'Ghi chú không được quá 100 ký tự'
    }),
    paymentMethod: Joi.string().valid("paypal", "cod", "VNPay").required().messages({
        'any.required': 'Phương thức thanh toán là bắt buộc',
        'string.empty': 'Phường/xã không được để trống',
    })
});


type Props = {
}

const CheckOutPage = () => {

    const [isAddAddresses, setAddAddresses] = useState<boolean>(false)
    const [isCheckAddresses, setCheckAddresses] = useState<boolean>(false)
    const [isUpdateAddresses, setUpdateAddresses] = useState<boolean>(false)
    const [idAddresses, setIdAddresses] = useState<any>()

    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [wardId, setWardId] = useState<number | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    const [priceShip, setPriceShip] = useState<number>(0)
    const [promotionShip, setPromotionShip] = useState<number>(0)
    const [promotionProduct, setPromotionProduct] = useState<number>(0)

    const [promotionAdd, setPromotionAdd] = useState<any>([])


    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Lấy dữ liệu từ giỏ hàng sang
    const location = useLocation();
    const checkouts = location.state || { selectedItems: [] };

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TCheckout>({
        resolver: joiResolver(checkoutSchema),
        defaultValues: {
            note: "",
            paymentMethod: "cod",
        }
    })

    const selectedPaymentMethod = watch("paymentMethod");

    // Lấy tất cả địa chỉ của user
    const token = localStorage.getItem('token');
    const { data: addresses, isLoading: isLoadAdress } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/shippingaddress`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
    })

    // Lấy địa chỉ mặc định của user
    useEffect(() => {
        if (!selectedAddress) {
            setSelectedAddress(addresses?.data?.data.find((item: any) => item.is_default))
        }
    }, [selectedAddress, addresses])

    // Lấy thông tin id để list ra đia chỉ
    useEffect(() => {
        if (selectedAddress) {
            setProvinceId(selectedAddress.city);
            setDistrictId(selectedAddress.district);
            setWardId(selectedAddress.ward);
        }
    }, [selectedAddress]);

    // Lấy tỉnh/thành phố
    const { data: province, isLoading: isLoadingProvinces } = useQuery({
        queryKey: ['province'],
        queryFn: async () => {
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694', // replace with your API key
                }
            });
        },
    });

    // Lấy quận/huyện
    const { data: district, isLoading: isLoadingDistrict } = useQuery({
        queryKey: ['district', provinceId],
        queryFn: async () => {
            if (!provinceId) return;
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                params: { province_id: provinceId },
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                }
            });
        },
        enabled: !!provinceId,
    });

    // Lấy phường/xã
    const { data: ward, isLoading: isLoadingWard } = useQuery({
        queryKey: ['ward', districtId],
        queryFn: async () => {
            if (!districtId) return;
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                params: { district_id: districtId },
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                }
            });
        },
        enabled: !!districtId,
    });

    const LocationDisplay = ({ wardId, districtId, provinceId }: any) => {
        const wardName = ward?.data.data.find((item: any) => item.WardCode === wardId);
        const districtName = district?.data.data.find((item: any) => item.DistrictID === parseInt(districtId));
        const provinceName = province?.data.data.find((item: any) => item.ProvinceID === parseInt(provinceId));
        return (
            <>
                {wardName?.WardName},&nbsp;
                {districtName?.DistrictName},&nbsp;
                {provinceName?.ProvinceName}
            </>
        );
    };

    const handleSelectProduct = (address: any) => {
        setSelectedAddress(addresses?.data?.data.find((item: any) => item.id === parseInt(address.check)))
        setValue("address", address.check)
    }

    const { handleContext, orderCod, orderATM } = useOrderMutations()

    const onSubmit = (data: any) => {
        const cart_id = checkouts.products.map((item: any) => item.cart_item_id)
        const { note, paymentMethod, address } = data
        const discounted_shipping_fee = Math.round(Number(promotionShip));
        const discounted_amount = Math.round(Number(promotionProduct));
        const promotion_ids = promotionAdd.map((item: any) => item.id)
        if (paymentMethod === "cod") {
            if (checkouts) {
                const order = { cart_id, promotion_ids, note, payment_type: paymentMethod, shipping_address_id: address, shipping_fee: priceShip, discounted_amount, discounted_shipping_fee, total: checkouts.totalPrice }
                orderCod.mutate(order)
            }
        } else {
            const order = { cart_id, promotion_ids, note, payment_type: "online", payment_method: paymentMethod, shipping_address_id: address, shipping_fee: priceShip, discounted_amount, discounted_shipping_fee, total: checkouts.totalPrice }
            orderATM.mutate(order)
        }
    }

    if (isLoadAdress || isLoadingProvinces || isLoadingDistrict || isLoadingWard) return (<LoadingPage />)

    return (
        <main>
            {handleContext}
            <div className="px-[15px] lg:flex pc:px-[80px] pc:py-[64px]">
                <ItemProducts promotionAdd={promotionAdd} promotionShip={promotionShip} promotionProduct={promotionProduct} checkouts={checkouts} selectedAddress={selectedAddress} setPriceShip={setPriceShip} priceShip={priceShip} setPromotionShip={setPromotionShip} setPromotionProduct={setPromotionProduct} setPromotionAdd={setPromotionAdd} />
                <div className="lg:w-[65%] lg:pr-[80px] lg:order-1">
                    <form onSubmit={handleSubmit(onSubmit)} action="">
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

                            {selectedAddress && (
                                <div key={selectedAddress.id} className="flex justify-between items-center p-[20px_15px]">
                                    <div className="mr-[20px]">
                                        <div className="flex mb-[10px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            <span className='text-[18px] ml-[5px]'>Địa chỉ nhận hàng</span>
                                        </div>
                                        <div>
                                            <div className="text-[18px] font-[600]">
                                                <span className='mr-[20px]'>{selectedAddress.full_name}</span>
                                                <span>{selectedAddress.phone_number}</span>
                                            </div>
                                            <div className="tex-[16px]">
                                                {selectedAddress.address_line},&nbsp;
                                                <LocationDisplay
                                                    wardId={selectedAddress.ward}
                                                    districtId={selectedAddress.district}
                                                    provinceId={selectedAddress.city}
                                                />
                                            </div>
                                            {selectedAddress?.is_default && (
                                                <div className="py-[5px] w-[70px] text-center rounded-[3px] text-[12px] mt-[5px] text-white bg-black">Mặc định</div>
                                            )}
                                            <input {...register("address")} value={selectedAddress.id} className='hidden' type="" name={selectedAddress.id} />
                                        </div>
                                    </div>
                                    <div onClick={() => { setCheckAddresses(!isCheckAddresses) }} className="text-[16px] font-[500] w-[70px] flex justify-end cursor-pointer ">Thay đổi</div>
                                </div>
                            )
                            }

                        </div>
                        <div className="">
                            <label className='text-[16px] font-[500] mb-[5px]'>Ghi chú</label>
                            <textarea {...register("note")} placeholder="Nhập ghi chú của bạn tại đây..." className='w-[100%] outline-none borde-[#787878] border-[1px] rounded-[5px] p-[10px]'></textarea>
                            {errors.note && (<span className='italic text-red-500 text-[12px]'>{errors.note?.message}</span>)}
                        </div>
                        <div className="mt-[15px]">
                            <h2 className='font-[700] text-[16px] mb-[5px]'>PHƯƠNG THỨC THANH TOÁN</h2>
                            <div className="">
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            {...register("paymentMethod", { required: true })}
                                            className='hidden'
                                            type="radio"
                                            id='payment-vnpay'
                                            value="VNPay"
                                        />
                                        <label htmlFor="payment-vnpay" className={`relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className={`${selectedPaymentMethod == 'VNPay' ? "bg-black" : ""} w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white`}></div>
                                        </label>
                                    </div>
                                    <img src="https://file.hstatic.net/1000284478/file/vnpay-40_5dbcecd2b4eb4245a4527d357a0459fc.svg" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng VNPay</span>
                                </div>
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            {...register("paymentMethod", { required: true })}
                                            className='hidden'
                                            type="radio"
                                            id='payment-paypal'
                                            value="paypal"
                                        />
                                        <label htmlFor="payment-paypal" className={`relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className={`${selectedPaymentMethod == 'paypal' ? "bg-black" : ""} w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white`}></div>
                                        </label>
                                    </div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng Paypal</span>
                                </div>
                                <div className="flex items-center py-[8px]">
                                    <div className="flex items-center mr-[10px]">
                                        <input
                                            {...register("paymentMethod", { required: true })}
                                            className='hidden'
                                            type="radio"
                                            id='payment-cod'
                                            value="cod"
                                        />
                                        <label htmlFor="payment-cod" className={`relative tab_color w-[20px] h-[20px] rounded-[50%] border-[1px] border-soli flex justify-center text-center`}>
                                            <div className={`${selectedPaymentMethod == 'cod' ? "bg-black" : ""} w-[18px] h-[18px] rounded-[50%] border-[5px] border-solid border-white`}></div>
                                        </label>
                                    </div>
                                    <img src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2022/11/ship-cod-la-gi-0.jpg" alt="logo" width={40} height={40} />
                                    <span className="ml-[10px] font-[600]">Thanh toán bằng tiền mặt</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex fixed bottom-0 left-0 w-[100%] justify-center lg:py-[32px] bg-[#F0F0F0] *:w-[50%] *:flex *:justify-center *:py-[18px] *:font-[600] *:text-[16px] lg:h-[126px] *:lg:w-[330px] *:lg:items-center ">
                            <Link to={`/carts`} className="bg-white lg:mr-[25px] select-none">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke="#2E2E2E" strokeLinecap="round" strokeLinejoin="round"></path> </svg>
                                QUAY LẠI GIỎ HÀNG</Link>
                            <button type='submit' className={`${orderCod.isPending || orderATM.isPending || !districtId || !checkouts ? "pointer-events-none bg-opacity-50" : ""} select-none bg-black text-white`}>HOÀN TẤT ĐƠN HÀNG</button>
                        </div>
                    </form>

                    <CheckAddresses selectedAddress={selectedAddress} handleSelectProduct={handleSelectProduct} isCheckAddresses={isCheckAddresses} isAddAddresses={isAddAddresses} isUpdateAddresses={isUpdateAddresses} setCheckAddresses={setCheckAddresses} setAddAddresses={setAddAddresses} setIdAddresses={setIdAddresses} setUpdateAddresses={setUpdateAddresses} />
                    <AddAddresses isCheckAddresses={isCheckAddresses} isAddAddresses={isAddAddresses} setCheckAddresses={setCheckAddresses} setAddAddresses={setAddAddresses} />
                    <UpdateAddresses isUpdateAddresses={isUpdateAddresses} isCheckAddresses={isCheckAddresses} setUpdateAddresses={setUpdateAddresses} setCheckAddresses={setCheckAddresses} idAddresses={idAddresses} />

                </div >



            </div >
        </main >
    )
}

export default CheckOutPage