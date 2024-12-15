import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

type Props = {}

const DetailReport = (props: Props) => {
    const { id } = useParams();

    const { data: reportData, isLoading } = useQuery({
        queryKey: ['reportInventory', id],
        queryFn: async () => {
            const response = await instance.get(`/api/admins/inventory/getprodetails/${id}`);
            return response.data;
        },
    });

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Chi Tiết Báo Cáo Sản Phẩm
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-lg font-medium text-gray-700">
                            <span className="font-bold">Tên sản phẩm:</span> {reportData.product_name}
                        </p>
                        <p className="text-lg font-medium text-gray-700">
                            <span className="font-bold">Slug:</span> {reportData.slug}
                        </p>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-700">
                            <span className="font-bold">Tổng số lượng:</span> {reportData.total_stock}
                        </p>
                        <p className="text-lg font-medium text-gray-700">
                            <span className="font-bold">Giá nhập:</span> {parseFloat(reportData.cost_price).toLocaleString()} VND
                        </p>
                        <p className="text-lg font-medium text-gray-700">
                            <span className="font-bold">Nhà cung cấp:</span> {reportData.supplier}
                        </p>
                    </div>
                </div>
            </div>

            {/* Import Details */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Chi Tiết Nhập Hàng
                </h2>
                {reportData.import_details.map((importDetail: any, index: number) => (
                    <div
                        key={index}
                        className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0"
                    >
                        <p className="text-lg font-semibold text-gray-700">
                            <span className="text-blue-500">Ngày:</span> {importDetail.import_date} -{' '}
                            <span className="text-blue-500">Thời gian:</span> {importDetail.import_time}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {importDetail.detail.map((variation: any) => (
                                <div
                                    key={variation.product_variation_value_id}
                                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                                >
                                    <p className="text-gray-800">
                                        <span className="font-bold">Màu sắc:</span> {variation.color}
                                    </p>
                                    <p className="text-gray-800">
                                        <span className="font-bold">Size:</span> {variation.size}
                                    </p>
                                    <p className="text-gray-800">
                                        <span className="font-bold">Số lượng:</span> {variation.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailReport;
