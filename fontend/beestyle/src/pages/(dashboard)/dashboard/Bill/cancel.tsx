import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import axios from 'axios';

const CancelBill: React.FC = () => {
    const { id } = useParams();
    const token = localStorage.getItem('token');

    // Fetch cancelled order details
    const { data: cancelBill, isLoading } = useQuery({
        queryKey: ['cancelbill', id],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
    });

    // Fetch province information
    const { data: provinces } = useQuery({
        queryKey: ['provinces'],
        queryFn: async () => {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                },
            });
            return response.data;
        },
    });

    const cityId = cancelBill?.city;

    // Fetch district information based on selected city
    const { data: districts } = useQuery({
        queryKey: ['districts', cityId],
        queryFn: async () => {
            const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                headers: { token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694' },
            });
            return response.data;
        },
    });

    useEffect(() => {
        // Reset district value when city changes
    }, [cancelBill?.city]);

    const provinceName = provinces?.data?.find((p: any) => p.ProvinceID === parseInt(cancelBill?.city))?.ProvinceName || "Không có tỉnh";
    const districtName = districts?.data?.find((d: any) => d.DistrictID === parseInt(cancelBill?.district))?.DistrictName || "Không có quận";

    const DetailRow = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
        <div className="flex items-center space-x-3">
            <span className="text-xl">{icon}</span>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`font-medium ${value === 'Đã hủy đơn hàng' ? 'text-red-500' : 'text-gray-800'}`}>{value}</p>
            </div>
        </div>
    );

    const FinancialRow = ({ label, value }: { label: string, value: string }) => (
        <div className="flex justify-between items-center">
            <span className="text-gray-700">{label}</span>
            <span className="font-semibold text-gray-900">{value} đ</span>
        </div>
    );

    if (isLoading) {
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    }

    return (
        <div className="p-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 border-l-4 border-red-500">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Đơn Hàng Hủy:
                        <span className="text-red-500 ml-2">{cancelBill?.code_orders}</span>
                    </h2>
                    <p className="text-gray-500">Chi tiết đơn hàng đã bị hủy</p>
                </div>

                {/* Order Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 bg-white rounded-lg shadow-md p-6 border">
                    {/* Customer Information */}
                    <div className="space-y-4 border-b md:border-b-0 md:border-r border-gray-200 pr-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Thông Tin Người Nhận</h3>
                        <div className="space-y-2">
                            <DetailRow
                                label="Người Nhận"
                                value={cancelBill?.full_name}
                                icon="👤"
                            />
                            <DetailRow
                                label="Địa Chỉ"
                                value={`${cancelBill?.address_line}, ${districtName}, ${provinceName}`}
                                icon="🏠"
                            />
                            <DetailRow
                                label="Email"
                                value={cancelBill?.email_receiver}
                                icon="✉️"
                            />
                            <DetailRow
                                label="Số Điện Thoại"
                                value={cancelBill?.phone_number}
                                icon="📱"
                            />
                        </div>
                    </div>

                    {/* Order Cancellation Details */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Chi Tiết Hủy Đơn</h3>
                        <div className="space-y-2">
                            <DetailRow
                                label="Trạng Thái"
                                value={cancelBill?.status_bill === 'canceled' ? 'Đã hủy đơn hàng' : cancelBill?.status_bill}
                                icon="🚚"
                            />
                            <DetailRow
                                label="Lý Do Hủy"
                                value={cancelBill?.cancel_reason || 'Không có lý do'}
                                icon="❌"
                            />
                            <DetailRow
                                label="Ngày Hủy"
                                value={cancelBill?.canceled_date || 'Chưa có'}
                                icon="📅"
                            />
                            <DetailRow
                                label="Giờ Hủy"
                                value={cancelBill?.canceled_time || 'Chưa có'}
                                icon="🕒"
                            />
                        </div>
                    </div>
                </div>

                {/* Financial Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6 border">
                    <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Chi Tiết Thanh Toán</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FinancialRow
                            label="Tổng Phụ"
                            value={parseFloat(cancelBill?.subtotal).toLocaleString()}
                        />
                        <FinancialRow
                            label="Phí Vận Chuyển"
                            value={parseFloat(cancelBill?.shipping_fee).toLocaleString()}
                        />
                        <FinancialRow
                            label="Giảm Giá"
                            value={parseFloat(cancelBill?.discounted_amount).toLocaleString()}
                        />
                        <div className="md:col-span-2 mt-4 border-t pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-800">Tổng Cộng</span>
                                <span className="text-2xl font-bold text-red-500">
                                    {parseFloat(cancelBill?.total).toLocaleString()} đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelBill;
