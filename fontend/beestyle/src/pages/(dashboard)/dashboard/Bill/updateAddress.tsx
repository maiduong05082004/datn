import instance from '@/configs/axios';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

interface TCheckout {
    full_name: string;
    address_line: string;
    city: string;
    district: string;
    ward: string;
    phone_number: string;
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
}).options({ stripUnknown: true });

const UpdateAddress = ({ closeModal, visible }: any) => {
    const queryClient = useQueryClient();

    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<TCheckout>({
        resolver: joiResolver(checkoutSchema),
    });

    const { id } = useParams();

    const { data: detailConfirm } = useQuery({
        queryKey: ['detailbill', id],
        queryFn: async () => {
            return instance.get(`/api/admins/orders/show_detailorder/${id}`);
        },
    });
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
        if (detailConfirm) {
            setValue("full_name", detailConfirm?.data.full_name);
            setValue("phone_number", detailConfirm?.data.phone_number);
            setValue("address_line", detailConfirm?.data.address_line);
            setValue("city", detailConfirm?.data.city);
            setValue("district", detailConfirm?.data.district);
            setValue("ward", detailConfirm?.data.ward);
        }
    }, [detailConfirm, setValue]);
    // useEffect(() => {
    //   setValue('district', '');
    // }, [cityId, setValue]);

    // useEffect(() => {
    //   setValue('ward', '');
    // }, [districtId, setValue]);

    const { mutate } = useMutation({
        mutationFn: async (addressData: any) => {
            try {
                return await instance.put(`/api/admins/shippingaddress/${detailConfirm?.data?.shipping_address_id}`, addressData);
            } catch (error) {
                throw new Error('Có lỗi xảy ra');
            }
        },
        onSuccess: () => {
            toast.success(`Cập nhật địa chỉ thành công`),
                queryClient.invalidateQueries({
                    queryKey: ['detailbill']
                })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });
    const onSubmit = (data: any) => {
        mutate(data);
        closeModal();
    };

    // update địa chỉ
    const renderAddressForm = () => (
        <form onSubmit={handleSubmit(onSubmit)} className='w-[100%]'>
            <div className='flex justify-center gap-5 pb-5'>
                <div className='w-[50%]'>
                    <input className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' type="text" placeholder='Nhập Họ và Tên'
                        {...register('full_name')}
                    />
                </div>
                <div className='w-[50%]'>
                    <input className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' type="text" placeholder='Nhập Họ và Tên'
                        {...register('phone_number')}
                    />
                </div>
            </div>
            <div className='w-[100%]'>
                <input className='border-[#868D95] border-[1px] rounded-[3px] p-[12px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]' type="text" placeholder='Nhập Họ và Tên'
                    {...register('address_line')}
                />
            </div>

            <div className="mt-[0px] lg:mt-[10px]">
                <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>TỈNH / THÀNH</label>
                {isLoadingProvinces ? (
                    <p>Đang tải tỉnh/thành...</p>
                ) : (
                    province && (
                        <select {...register('city')} onClick={() => setValue("district", '')} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]'>
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
                    <div className="mt-[0px] lg:mt-[10px]">
                        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>QUẬN / HUYỆN</label>
                        <select {...register('district')} onClick={() => setValue("ward", '')} className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[0px] lg:mt-[8px]'>
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
                    <div className="mt-[0px] lg:mt-[10px]">
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
            {/* Nút Submit */}
            <div className="flex mt-[20px] justify-end">
                <button type='submit' className='text-white bg-black p-[10px_20px] rounded-[3px] font-[500]'>Cập nhật</button>
            </div>
        </form>
    );
    return (
        <>
            <ToastContainer />
            <Modal
                title="Cập Nhật Địa Chỉ"
                visible={visible}
                onCancel={closeModal}
                footer={null}
            >
                {renderAddressForm()}
            </Modal>
        </>
    )
}

export default UpdateAddress