import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';

type OrderDetail = {
    shop_id: number;
    client_id: number;
    return_name: string;
    return_phone: string;
    return_address: string;
    return_ward_code: string;
    return_district_id: number;
    from_name: string;
    from_phone: string;
    from_address: string;
    from_ward_code: string;
    from_district_id: number;
    to_name: string;
    to_phone: string;
    to_address: string;
    to_ward_code: string;
    to_district_id: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    cod_amount: number;
    insurance_value: number;
    order_value: number;
    required_note: string;
    content: string;
    note: string;
    pickup_time: string;
    items: Array<{
        name: string;
        code: string;
        quantity: number;
        length: number;
        width: number;
        height: number;
        weight: number;
    }>;
    status: string;
};

type Props = {};

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
    const { data: orderDetail, isLoading } = useQuery<OrderDetail>({
        queryKey: ['shipping', id],
        queryFn: async () => {
            const response = await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/ghn-detail/${id}`);
            return response.data.order_detail;
        }
    });

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    return (
        <div className="p-8">
            {orderDetail && (
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Thông tin đơn hàng */}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-slate-100 rounded-lg h-[50px] flex items-center px-5 border-b border-gray-300">
                                Thông Tin Đơn Hàng
                            </h2>
                            <div className="space-y-2 px-5">
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Mã Đơn Hàng:</strong>
                                    <span>{orderDetail.client_id}</span>
                                </p>
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Ngày Lấy Dự Kiến:</strong>
                                    <span>{new Date(orderDetail.pickup_time).toLocaleDateString()}</span>
                                </p>
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Ngày Giao Dự Kiến:</strong>
                                    <span>{new Date(orderDetail.pickup_time).toLocaleDateString()}</span>
                                </p>
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Trạng Thái Hiện Tại:</strong>
                                    <div className="w-[200px] h-[30px] border flex justify-center items-center rounded-md bg-blue-700 text-white">
                                        <span className="text-white font-semibold">
                                            {statusDescriptions[orderDetail.status] || "Trạng thái không xác định"}
                                        </span>
                                    </div>
                                </p>
                            </div>
                        </div>

                        {/* Thông tin người nhận */}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-slate-100 rounded-lg h-[50px] flex items-center px-5 border-b border-gray-300">
                                Thông Tin Chi Tiết
                            </h2>
                            <div className="space-y-2 px-5">
                                <p className="flex">
                                    <strong className="text-gray-600"><h2 className='w-[150px]'>Sản Phẩm:</h2></strong>
                                    <span>{orderDetail.content}</span>
                                </p>
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Cân Nặng:</strong>
                                    <span>{orderDetail.weight} gram</span>
                                </p>
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Lưu Ý Giao Hàng:</strong>
                                    <span>{orderDetail.required_note}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Người Nhận */}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-slate-100 rounded-lg h-[50px] flex items-center px-5 border-b border-gray-300">
                                Người Nhận
                            </h2>
                            <div className="space-y-2 px-5">
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Họ và Tên:</strong>
                                    <span>{orderDetail.to_name}</span>
                                </p>
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Điện Thoại:</strong>
                                    <span>{orderDetail.to_phone}</span>
                                </p>
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Địa Chỉ:</strong>
                                    <span>{orderDetail.to_address}</span>
                                </p>
                            </div>
                        </div>

                        {/* Chi phí */}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-slate-100 rounded-lg h-[50px] flex items-center px-5 border-b border-gray-300">
                                Chi Phí
                            </h2>
                            <div className="space-y-2 px-5">
                                <p className="flex">
                                    <strong className="text-gray-600 w-[150px]">Người Trả:</strong>
                                    <span>Người nhận trả phí</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shipping;
