import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import instance from '@/configs/axios';
import { Spin } from 'antd';

type Props = {}

const DetailBanner = (props: Props) => {
    const { id } = useParams();
    const { data: detailBanner, isLoading } = useQuery({
        queryKey: ['detailBanner', id],
        queryFn: async () => {
            const response = await instance.get(`api/admins/banners/${id}`);
            return response.data;
        }
    });
    const { data: categoryData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await instance.get('api/admins/categories');
            return response.data;
        },
    });

    const categoryMap = categoryData?.reduce((map: any, category: any) => {
        map[category.id] = category.name;
        return map;
    }, {});

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    return (
        <div className="max-w-8xl mx-auto p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex justify-center">
                    <img
                        src={detailBanner.image_path}
                        alt="Banner"
                        className="object-cover rounded-lg shadow-md border transition-transform transform hover:scale-105"
                    />
                </div>

                {/* Thông tin chi tiết */}
                <div className="md:col-span-2 space-y-6">
                    {/* ID */}
                    <div className="flex items-center">
                        <strong className="w-40 text-gray-700 font-medium">ID:</strong>
                        <span className="text-gray-900">{detailBanner.id}</span>
                    </div>

                    {/* Danh mục */}
                    <div className="flex items-center">
                        <strong className="w-40 text-gray-700 font-medium">Danh mục:</strong>
                        <span className="text-gray-900">
                            {categoryMap[detailBanner.category_id] || "N/A"}
                        </span>
                    </div>

                    {/* Tiêu đề */}
                    <div className="flex items-center">
                        <strong className="w-40 text-gray-700 font-medium">Tiêu đề:</strong>
                        <span className="text-gray-900">{detailBanner.title}</span>
                    </div>

                    {/* Đường dẫn */}
                    <div className="flex items-center">
                        <strong className="w-40 text-gray-700 font-medium">Đường dẫn:</strong>
                        <a
                            href={detailBanner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline hover:text-blue-800"
                        >
                            {detailBanner.link || "N/A"}
                        </a>
                    </div>

                    {/* Loại */}
                    <div className="flex items-center">
                        <strong className="w-40 text-gray-700 font-medium">Loại:</strong>
                        <span className="text-gray-900 capitalize">
                            {detailBanner.type || "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailBanner;
