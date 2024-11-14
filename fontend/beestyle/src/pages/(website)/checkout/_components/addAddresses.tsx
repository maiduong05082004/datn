import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import { parse } from 'date-fns';
import Joi from 'joi';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
    isCheckAddresses: boolean;
    isAddAddresses: boolean;
    setCheckAddresses: Dispatch<SetStateAction<boolean>>;
    setAddAddresses: Dispatch<SetStateAction<boolean>>;
};

interface TCheckout {
    full_name: string;
    address_line: string;
    city: string;
    district: string;
    ward: string;
    phone_number: string;
    paymentMethod: string;
    is_default: boolean;
}
const checkoutSchema = Joi.object({
    full_name: Joi.string().required().min(5).max(30).messages({
        'any.required': 'Tên người nhận là bắt buộc',
        'string.empty': 'Tên không được để trống',
        'string.min': 'Tên người nhận phải có ít nhất 5 ký tự',
        'string.max': 'Tên người nhận không được quá 50 ký tự',
    }),
    phone_number: Joi.string()
        .required()
        .min(10)
        .max(15)
        .pattern(/^[0-9]+$/)
        .messages({
            'any.required': 'Số điện thoại là bắt buộc',
            'string.empty': 'Số điện thoại không được để trống',
            'string.min': 'Số điện thoại phải có ít nhất 10 số',
            'string.max': 'Số điện thoại phải có tối đa 15 số',
            'string.pattern.base': 'Số điện thoại chỉ được chứa các ký tự số',
        }),
    address_line: Joi.string().required().messages({
        'string.empty': 'Địa chỉ không được để trống',
        'any.required': 'Địa chỉ là bắt buộc',
    }),
    city: Joi.string().required().messages({
        'string.empty': 'Tỉnh/thành không được để trống',
        'any.required': 'Tỉnh/thành là bắt buộc',
    }),
    district: Joi.string().required().messages({
        'string.empty': 'Quận/huyện không được để trống',
        'any.required': 'Quận/huyện là bắt buộc',
    }),
    ward: Joi.string().required().messages({
        'string.empty': 'Phường/xã không được để trống',
        'any.required': 'Phường/xã là bắt buộc',
    }),
    is_default: Joi.boolean(),
});


const AddAddresses = ({ isCheckAddresses, isAddAddresses, setCheckAddresses, setAddAddresses }: Props) => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const token = localStorage.getItem('token');
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<TCheckout>({
        resolver: joiResolver(checkoutSchema),
        defaultValues: {
            full_name: "",
            address_line: "",
            city: "",
            district: "",
            ward: "",
            phone_number: "",
            is_default: false,
        },
    });

    const { data: addresses } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/shippingaddress`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
    })

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

    const cityId: any = watch('city');
    const province_id = parseInt(cityId)
    const { data: district, isLoading: isLoadingDistrict } = useQuery({
        queryKey: ['district', cityId],
        queryFn: async () => {
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                params: { province_id },
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                }
            });
        },
        enabled: !!cityId,
    });

    const districtId: any = watch('district');
    const district_id = parseInt(districtId)
    const { data: ward, isLoading: isLoadingWard } = useQuery({
        queryKey: ['ward', districtId],
        queryFn: async () => {
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                params: { district_id },
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                }
            });
        },
        enabled: !!districtId,
    });

    useEffect(() => {
        setValue("district", '');
    }, [watch("city")]);
    useEffect(() => {
        setValue("ward", '');
    }, [watch("district")]);

    const { mutate } = useMutation({
        mutationFn: (addressData: TCheckout) => {
            try {
                return axios.post(`http://127.0.0.1:8000/api/client/shippingaddress`, addressData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                throw new Error('Có lỗi xảy ra, vui lòng thử lại!')
            }
        },
        onSuccess: () => {
            messageApi.open({ type: 'success', content: 'Thêm địa chỉ thành công' }),
                queryClient.invalidateQueries({
                    queryKey: ['addresses']
                })
            setTimeout(() => {
                setAddAddresses(!isAddAddresses)
                setCheckAddresses(!isCheckAddresses)
                reset();
            });
        },
        onError: (error) => {
            messageApi.open({ type: 'error', content: error.message });
        },
    });

    const onSubmit = (data: TCheckout) => {
        mutate(data);
    };

    return (
        <>
            {contextHolder}
            {isAddAddresses && (
                <div className={`fixed z-20 flex-col top-0`}>
                    <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 flex top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] min-w-[300px] max-w-[600px] w-[100%] p-[20px]">
                        <form onSubmit={handleSubmit(onSubmit)} className='w-[100%]'>
                            <h2 className='font-[700] text-[20px]'>Địa chỉ mới</h2>
                            <div className="h-[500px] overflow-y-auto lg:overflow-auto lg:h-auto">
                                <div className="lg:flex lg:flex-wrap lg:justify-between ">
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>HỌ VÀ TÊN</label>
                                        <input {...register("full_name")} className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' type="text" placeholder='Nhập Họ và Tên' />
                                        {errors.full_name && (<span className='italic text-red-500 text-[12px]'>{errors.full_name.message}</span>)}
                                    </div>
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="phone" className='text-[#868D95] font-[600] text-[13px]'>SỐ ĐIỆN THOẠI</label>
                                        <input {...register("phone_number")} className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' type="text" placeholder='Nhập số điện thoại' />
                                        {errors.phone_number && (<span className='italic text-red-500 text-[12px]'>{errors.phone_number.message}</span>)}
                                    </div>
                                </div>

                                <div className={`lg:flex lg:flex-wrap lg:justify-between`}>
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>ĐỊA CHỈ</label>
                                        <input {...register("address_line")} className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' type="text" placeholder='Nhập địa chỉ' />
                                        {errors.address_line && (<span className='italic text-red-500 text-[12px]'>{errors.address_line.message}</span>)}
                                    </div>
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>TỈNH / THÀNH</label>
                                        {isLoadingProvinces ? (
                                            <p>Đang tải tỉnh/thành...</p>
                                        ) : (
                                            province && (
                                                <select {...register('city')} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]'>
                                                    <option value="" disabled>-- Chọn Tỉnh / Thành --</option>
                                                    {province?.data?.data.map((item: any) => (
                                                        <option key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName}</option>
                                                    ))}
                                                </select>
                                            )
                                        )}
                                        {errors.city && (<span className='italic text-red-500 text-[12px]'>{errors.city.message}</span>)}
                                    </div>
                                    {isLoadingDistrict ? (
                                        <p>Đang tải quận/huyện...</p>
                                    ) : (
                                        district?.data && (
                                            <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                                <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>QUẬN / HUYỆN</label>
                                                <select {...register('district')} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]'>
                                                    <option value="" disabled>-- Chọn Quận / Huyện --</option>
                                                    {district.data.data.map((item: any) => (
                                                        <option key={item.DistrictID} value={item.DistrictID}>{item.DistrictName}</option>
                                                    ))}
                                                </select>
                                                {errors.district && (<span className='italic text-red-500 text-[12px]'>{errors.district.message}</span>)}
                                            </div>
                                        )
                                    )}
                                    {isLoadingWard ? (
                                        <p>Đang tải phường/xã...</p>
                                    ) : (
                                        ward?.data && (
                                            <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                                <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>PHƯỜNG / XÃ</label>
                                                <select {...register('ward')} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]'>
                                                    <option value="" disabled>-- Chọn Phường / Xã --</option>
                                                    {ward.data.data.map((item: any) => (
                                                        <option key={item.WardCode} value={item.WardCode}>{item.WardName}</option>
                                                    ))}
                                                </select>
                                                {errors.ward && (<span className='italic text-red-500 text-[12px]'>{errors.ward.message}</span>)}
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="flex items-center mt-[20px]">
                                    <input {...register("is_default")} type="checkbox" />
                                    <label className='ml-[5px]'>Đặt làm mặc định</label>
                                </div>
                            </div>
                            <div className="flex mt-[20px] justify-end">
                                {addresses?.data?.data.length === 0 ? "" : (
                                    <div onClick={() => {
                                        setCheckAddresses(!isCheckAddresses);
                                        setAddAddresses(!isAddAddresses);
                                        reset({
                                            full_name: "",
                                            address_line: "",
                                            city: "",
                                            district: "",
                                            ward: "",
                                            phone_number: "",
                                            is_default: false,
                                        });
                                    }} className="cursor-pointer mr-[20px] text-black bg-[#F8F8F8] p-[10px_20px] rounded-[3px] font-[500]">Trở lại</div>
                                )}
                                <button type='submit' className='text-white bg-black p-[10px_20px] rounded-[3px] font-[500]'>Thêm mới</button>
                            </div>
                        </form>
                    </div>
                    <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
                </div>
            )}
        </>
    );
};

export default AddAddresses;
