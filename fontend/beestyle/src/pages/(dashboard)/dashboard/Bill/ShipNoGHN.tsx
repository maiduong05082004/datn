import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, Spin, Carousel } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

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

const ShipNoGHN: React.FC = () => {
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

    // Fetch dữ liệu chi tiết đơn hàng
    const { data: detailBill, isLoading } = useQuery({
        queryKey: ['detailbill', id],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
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

    const cityId = detailBill?.city;

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
    const provinceName = provinces?.data?.find((p: any) => p.ProvinceID === parseInt(detailBill?.city))?.ProvinceName || "Không có tỉnh";
    const districtName = districts?.data?.find((d: any) => d.DistrictID === parseInt(detailBill?.district))?.DistrictName || "Không có quận";

    if (isLoading) {
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    }

    const dataSource = detailBill?.bill_detail.map((item: any, index: number) => ({
        key: index,
        productName: item.name,
        price: parseFloat(item.price).toLocaleString() + ' đ',
        color: item.attribute_value_color,
        size: item.attribute_value_size,
        quantity: item.quantity,
        discount: item.discount + '%',
        totalAmount: parseFloat(item.total_amount).toLocaleString() + ' đ',
        images: item.variation_images,
    })) || [];

    return (
        <div className="px-6 py-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                Đơn Hàng: <span className="text-blue-500">{detailBill?.code_orders}</span>
            </h2>

            {/* Thông tin chi tiết */}
            <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Người Nhận:</strong> {detailBill?.full_name}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Địa Chỉ:</strong> {`${detailBill?.address_line}, ${districtName}, ${provinceName}`}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Email:</strong> {detailBill?.email_receiver}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Số Điện Thoại:</strong> {detailBill?.phone_number}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Ghi Chú:</strong> {detailBill?.note}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Hình Thức Thanh Toán:</strong> {detailBill?.payment_type_description}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Trạng Thái Đơn Hàng:</strong>
                        <span className={`ml-2 text-lg font-semibold ${detailBill?.status_bill === 'Đang Vận Chuyển' || detailBill?.status_bill === 'Đã hủy đơn hàng' ? 'text-red-500' : 'text-green-500'}`}>
                            {detailBill?.status_bill === 'shipped' ? 'Đang Giao Hàng' : detailBill?.status_bill}
                        </span>
                    </p>

                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Ngày Đặt Hàng:</strong> {detailBill?.order_date} {detailBill?.order_time}
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Tổng Phụ:</strong> {parseFloat(detailBill?.subtotal).toLocaleString()} đ
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Phí Vận Chuyển:</strong> {parseFloat(detailBill?.shipping_fee).toLocaleString()} đ
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Giảm Giá Đã Áp Dụng:</strong> {parseFloat(detailBill?.discounted_amount).toLocaleString()} đ
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        <strong className="text-gray-800">Giảm Giá Phí Vận Chuyển:</strong> {parseFloat(detailBill?.discounted_shipping_fee).toLocaleString()} đ
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                        <strong className="text-gray-800">Tổng Cộng:</strong>
                        <span className="text-red-500 ml-2">{parseFloat(detailBill?.total).toLocaleString()} đ</span>
                    </p>
                </div>
            </div>

            {/* Khuyến mãi */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-xl font-bold text-gray-800 mb-4">Khuyến Mãi Đã Áp Dụng:</p>
                <ul className="list-disc list-inside pl-4 text-lg text-gray-700 space-y-2">
                    {detailBill?.promotions?.map((promotion: any, index: number) => (
                        <li key={index}>
                            <strong className="text-gray-800">{promotion.code}:</strong> {promotion.description} - Giảm {promotion.discount_amount}%
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bảng sản phẩm */}
        </div>

    );
};

export default ShipNoGHN;
