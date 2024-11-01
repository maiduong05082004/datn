import { joiResolver } from '@hookform/resolvers/joi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Joi from 'joi';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

type Props = {
    isCheckAddresses: boolean
    isAddAddresses: boolean
    setCheckAddresses: Dispatch<SetStateAction<boolean>>
    setAddAddresses: Dispatch<SetStateAction<boolean>>
}
interface TCheckout {
    full_name: string;
    address_line: string;
    city: string;
    district: string;
    ward: string;
    phone_number: string;
    paymentMethod: string;
    is_default: boolean
}

const AddAddresses = ({ isCheckAddresses, isAddAddresses, setCheckAddresses, setAddAddresses }: Props) => {
    const [todos, setTodos] = useState<boolean>(false)
    const [address, setAddress] = useState<any>();
    const [resultsId, setResultsId] = useState<any>();
    const [districtId, setDistrictId] = useState<any>();
    const [wardsId, setWardsId] = useState<any>();

    // console.log(checkouts);
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
            .pattern(/^[0-9]+$/) // Chỉ cho phép các ký tự số
            .messages({
                'any.required': 'Số điện thoại là bắt buộc',
                'string.empty': 'Số điện thoại không được để trống',
                'string.min': 'Số điện thoại phải có ít nhất 10 số',
                'string.max': 'Số điện thoại phải có tối đa 15 số',
                'string.pattern.base': 'Số điện thoại chỉ được chứa các ký tự số',
            }),
        address_line: Joi.string().required().messages({
            'string.empty': 'Địa chỉ không được để trống',
            'any.required': 'Địa chỉ là bắt buộc'
        }),
        city: Joi.string().required().messages({
            'string.empty': 'Tỉnh/thành không được để trống',
            'any.required': 'Tỉnh/thành là bắt buộc'
        }),
        district: Joi.string().required().messages({
            'string.empty': 'Quận/huyện không được để trống',
            'any.required': 'Quận/huyện là bắt buộc'
        }),
        ward: Joi.string().required().messages({
            'string.empty': 'Phường/xã không được để trống',
            'any.required': 'Phường/xã là bắt buộc'
        }),
        is_default: Joi.boolean()
    });

    const token = localStorage.getItem('token');
    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<TCheckout>({
        resolver: joiResolver(checkoutSchema),
        defaultValues: {
            full_name: "",
            address_line: "",
            city: "",
            district: "",
            ward: "",
            phone_number: "",
            is_default: false
        }
    })

    // Hàm xử lý khi người dùng nhập giá trị vào ô input
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleResults = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newResultsId = e.target.value;
        const selectedProvince = results?.data.results.find((item: any) => item.province_id === newResultsId);
        if (selectedProvince) {
            setValue("city", selectedProvince.province_name);
        }
        setResultsId(newResultsId);
        setDistrictId(undefined);
        setWardsId(undefined);

    };
    const handleDistricts = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDistrictId = e.target.value;
        const selectedDistrict = district?.data.results.find((item: any) => item.district_id === newDistrictId);
        if (selectedDistrict) {
            setValue("district", selectedDistrict.district_name);
        }
        setDistrictId(newDistrictId);
        setWardsId(undefined);
    };
    const handleWards = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newWardsId = e.target.value;
        const selectedWards = ward?.data.results.find((item: any) => item.ward_id === newWardsId);
        if (selectedWards) {
            setValue("ward", selectedWards.ward_name)
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
        enabled: !!districtId
    });


    const onSubmit = async (data: any) => {
        console.log(data);

    }
    return (
        <>
            {isAddAddresses && (
                <div className={`fixed z-10 flex-col top-0`}>
                    <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 flex top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] min-w-[300px] max-w-[600px] w-[100%] p-[20px]">
                        <form onSubmit={handleSubmit(onSubmit)} className='w-[100%]'>

                            <h2 className='font-[700] text-[20px]'>Địa chỉ mới</h2>
                            <div className="h-[500px] overflow-y-auto lg:overflow-auto lg:h-auto">
                                <div className="lg:flex lg:flex-wrap lg:justify-between ">
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>HỌ VÀ TÊN</label>
                                        <input  {...register("full_name", { required: true })} className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' type="text" placeholder='Nhập Họ và Tên' />
                                        {errors.full_name && (<span className='italic text-red-500 text-[12px]'>{errors.full_name?.message}</span>)}
                                    </div>
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="phone" className='text-[#868D95] font-[600] text-[13px]'>
                                            SỐ ĐIỆN THOẠI
                                        </label>
                                        <input
                                            {...register("phone_number", { required: true })}
                                            className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]'
                                            type="text"
                                            placeholder='Nhập số điện thoại'
                                        />
                                        {errors.phone_number && (<span className='italic text-red-500 text-[12px]'>{errors.phone_number?.message}</span>)}
                                    </div>
                                </div>

                                <div className={`lg:flex lg:flex-wrap lg:justify-between`}>

                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>ĐỊA CHỈ</label>
                                        <input
                                            {...register("address_line", { required: true })}
                                            className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]'
                                            type="text"
                                            placeholder='Nhập địa chỉ'
                                        />
                                        {errors.address_line && (<span className='italic text-red-500 text-[12px]'>{errors.address_line?.message}</span>)}
                                    </div>
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>TỈNH / THÀNH</label>
                                        <select {...register("city", { required: true })} onChange={handleResults} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' name="" id="" value={resultsId || ''}>
                                            <option value="" disabled>-- Chọn Tỉnh / Thành --</option>
                                            {results?.data.results.map((item: any) => (
                                                <option key={item.province_id} value={item.province_id}>{item.province_name}</option>
                                            ))}
                                        </select>
                                        {errors.city && (<span className='italic text-red-500 text-[12px]'>{errors.city?.message}</span>)}
                                    </div>
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>QUẬN / HUYỆN</label>
                                        <select {...register("district", { required: true })} onChange={handleDistricts} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' name="" id="" value={districtId || ''}>
                                            <option value="" disabled>-- Chọn Quận / Huyện --</option>
                                            {district?.data.results.map((item: any) => (
                                                <option key={item.district_id} value={item.district_id}>{item.district_name}</option>
                                            ))}
                                        </select>
                                        {errors.district && (<span className='italic text-red-500 text-[12px]'>{errors.district?.message}</span>)}
                                    </div>
                                    <div className="mt-[0px] lg:mt-[10px] lg:w-[48%]">
                                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>PHƯỜNG / XÃ</label>
                                        <select {...register("ward", { required: true })} onChange={handleWards} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' name="" id="" value={wardsId || ''}>
                                            <option value="" disabled>-- Chọn Phường / Xã --</option>
                                            {ward?.data.results.map((item: any) => (
                                                <option key={item.ward_id} value={item.ward_id}>{item.ward_name}</option>
                                            ))}
                                        </select>
                                        {errors.ward && (<span className='italic text-red-500 text-[12px]'>{errors.ward?.message}</span>)}
                                    </div>
                                </div>

                                <div className="flex items-center mt-[20px]">
                                    <input  {...register("is_default")} checked={watch("is_default")} onChange={(e) => setValue("is_default", e.target.checked)} type="checkbox" name="" id="" />
                                    <table className='ml-[5px]'>Đặt làm mặc định</table>
                                </div>
                            </div>
                            <div className="flex mt-[20px] justify-end">
                                <div onClick={() => {
                                    setCheckAddresses(!isCheckAddresses), setAddAddresses(!isAddAddresses), reset({
                                        full_name: "",
                                        address_line: "",
                                        city: "",
                                        district: "",
                                        ward: "",
                                        phone_number: "",
                                        is_default: false
                                    });
                                }} className="cursor-pointer mr-[20px] text-black bg-[#F8F8F8] p-[10px_20px] rounded-[3px] font-[500]">Trở lại</div>
                                <button type='submit' className='text-white bg-black p-[10px_20px] rounded-[3px] font-[500]'>Thêm mới</button>
                            </div>
                        </form>
                    </div>
                    <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
                </div>
            )}
        </>

    )
}

export default AddAddresses