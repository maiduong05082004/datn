import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import axios from 'axios';
import { useForm } from 'react-hook-form';

type Props = {

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

const statusDescriptions: { [key: string]: string } = {
    ready_to_pick: "Chờ Lấy Hàng",
    picking: "Nhân viên đang lấy hàng",
    cancel: "Hủy đơn hàng",
    picked: "Nhân viên đã lấy hàng",
    storing: "Hàng đang nằm ở kho",
    transporting: "Đang luân chuyển hàng",
    waiting_to_return: "Đang đợi trả hàng về cho người gửi",
    return: "Trả hàng",
    returned: "Nhân viên trả hàng thành công",
};

const Shipping = (props: Props) => {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const { setValue, formState: { errors }, watch } = useForm<TCheckout>({
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
    
    const { data: orderDetail, isLoading } = useQuery({
        queryKey: ['shipping', id],
        queryFn: async () => {
            const response = await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/ghn-detail/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            return response.data.order_detail;
        }
    });
    const { data: provinces } = useQuery({
        queryKey: ['provinces '],
        queryFn: async () => {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                }
            });
            return response.data;
        },
    });

    const cityId = orderDetail?.city;

    const { data: districts } = useQuery({
        queryKey: ['districts', cityId],
        queryFn: async () => {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                headers: { token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694' }
            });
            return response.data;
        },
    }); 

    useEffect(() => {
        setValue("district", '');
    }, [watch("city")]);
    const provinceName = provinces?.data?.find((p: any) => p.ProvinceID === parseInt(orderDetail?.city))?.ProvinceName || "Không có tỉnh";
    const districtName = districts?.data?.find((d: any) => d.DistrictID === parseInt(orderDetail?.district))?.DistrictName || "Không có quận";

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    return (
        <>
            <div className="py-5">
                {orderDetail && (
                    <>
                        <div className="w-[90%] m-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6">
                                <div className="">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-[#f5f5f5] rounded-md h-[50px] flex items-center px-5">
                                        Thông Tin Đơn Hàng
                                    </h2>
                                    <div className="space-y-2 px-5">
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Mã Đơn Hàng:</strong>
                                            <span className='text-sm font-semibold'>{orderDetail.order_code}</span>
                                        </p>
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Ngày Lấy Dự Kiến:</strong>
                                            <span className='text-sm font-semibold'>{new Date(orderDetail.pickup_time).toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Ngày Giao Dự Kiến:</strong>
                                            <span className='text-sm font-semibold'>{new Date(orderDetail.pickup_time).toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Trạng Thái Hiện Tại:</strong>
                                            <div className="w-auto h-[30px] p-2 border flex justify-center items-center rounded-md bg-blue-700 text-white">
                                                <span className="text-white font-semisemibold">
                                                    {statusDescriptions[orderDetail.status] || "Trạng thái không xác định"}
                                                </span>
                                            </div>
                                        </p>
                                    </div>
                                </div>

                                {/* Thông tin người nhận */}
                                <div className="">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-[#f5f5f5] rounded-md h-[50px] flex items-center px-5">
                                        Thông Tin Chi Tiết
                                    </h2>
                                    <div className="space-y-2 px-5">
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] text-sm font-normal"><h2 className='w-[150px]'>Sản Phẩm:</h2></strong>
                                            <span className='text-sm font-semibold'>{orderDetail.content}</span>
                                        </p>
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Cân Nặng:</strong>
                                            <span className='text-sm font-semibold'>{orderDetail.weight} gram</span>
                                        </p>
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Lưu Ý Giao Hàng:</strong>
                                            <span className='text-sm font-semibold'>{orderDetail.required_note}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6">
                                {/* Người Nhận */}
                                <div className="">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-[#f5f5f5] rounded-md h-[50px] flex items-center px-5">
                                        Người Nhận
                                    </h2>
                                    <div className="space-y-2 px-5">
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Họ và Tên:</strong>
                                            <span className='text-sm font-semibold'>{orderDetail.to_name}</span>
                                        </p>
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Điện Thoại:</strong>
                                            <span className='text-sm font-semibold'>{orderDetail.to_phone}</span>
                                        </p>
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Địa Chỉ:</strong>
                                            <span className='text-sm font-semibold'>{`${orderDetail?.to_address}, ${districtName}, ${provinceName}`}</span>

                                        </p>
                                    </div>
                                </div>

                                {/* Chi phí */}
                                <div className="">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-[#f5f5f5] rounded-md h-[50px] flex items-center px-5">
                                        Chi Phí
                                    </h2>
                                    <div className="space-y-2 px-5">
                                        <p className="flex py-[6px]">
                                            <strong className="text-[#141414] w-[150px] text-sm font-normal">Người Trả:</strong>
                                            <span className='text-sm font-semibold'>Người nhận trả phí</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-[#f5f5f5] w-[100%] h-auto pt-4'>
                            <div className='w-[90%] border m-auto bg-white py-5 rounded-md'>
                                <div className=''>
                                    <h2 className='text-[18px] font-semibold px-5 pb-5'>Lịch Sử Đơn Hàng</h2>
                                </div>
                                <hr />
                                <div className='px-5 py-5'>
                                    <div className='grid grid-cols-3 text-[#141414] border p-3 bg-[#f5f5f5]'>
                                        <div className='font-semibold'>Ngày : {new Date(orderDetail.pickup_time).toLocaleDateString()}</div>
                                        <div className='font-semibold'>Chi tiết</div>
                                        <div className='font-semibold'>Thời gian</div>
                                    </div>
                                    <div className='grid grid-cols-3 py-2'>
                                        <div className='text-blue-700 font-medium px-5'>{statusDescriptions[orderDetail.status] || "Trạng thái không xác định"}</div>
                                        <div>{orderDetail.from_address}</div>
                                        <div>{new Date(orderDetail.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-[90%] border m-auto bg-white py-5 rounded-md mt-5'>
                                <div className=''>
                                    <h2 className='text-[18px] font-semibold px-5 pb-5'>Nhật Ký Người Dùng</h2>
                                </div>
                                <hr />
                                <div className='px-5 py-5'>
                                    <div className='grid grid-cols-3 text-[#141414] border p-3 bg-[#f5f5f5]'>
                                        <div className='font-semibold'>Thời Gian</div>
                                        <div className='font-semibold'>Người Thay Đổi</div>
                                        <div className='font-semibold'>Hành Động</div>
                                    </div>
                                    <div className='grid grid-cols-3 py-2'>
                                        <div className='font-semibold px-5'>Ngày :{new Date(orderDetail.pickup_time).toLocaleDateString()}</div>
                                        <span className='text-sm font-semibold'>{orderDetail.to_name}</span>
                                        <div className='text-blue-700 font-medium'>{statusDescriptions[orderDetail.status] || "Trạng thái không xác định"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Shipping;
