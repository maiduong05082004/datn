import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/configs/axios';
import { Spin } from 'antd';

type Props = {}

const DetailBanner = (props: Props) => {
    const { id } = useParams();
    const { data: detailBanner, isLoading } = useQuery({
        queryKey: ['detailBanner', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/banners/${id}`);
            return response.data;
        }
    });
    const { data: categoryData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
            return response.data;
        },
    });

    const categoryMap = categoryData?.reduce((map : any, category : any) => {
        map[category.id] = category.name;
        return map;
    }, {});

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Detail Banner</h1>
        <div className="space-y-4">
            <div className="flex items-center">
                <strong className="w-32 text-gray-700">ID:</strong>
                <span>{detailBanner.id}</span>
            </div>
            <div className="flex items-center">
                <strong className="w-32 text-gray-700">Category:</strong>
                <span>{categoryMap[detailBanner.category_id] || 'N/A'}</span>
            </div>
            <div className="flex items-center">
                <strong className="w-32 text-gray-700">Title:</strong>
                <span>{detailBanner.title}</span>
            </div>
            <div className="flex items-center">
                <strong className="w-32 text-gray-700">Image:</strong>
                <img src={detailBanner.image_path} alt="Banner" className="w-48 h-24 object-cover rounded-md" />
            </div>
            <div className="flex items-center">
                <strong className="w-32 text-gray-700">Link:</strong>
                <a href={detailBanner.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{detailBanner.link}</a>
            </div>
            <div className="flex items-center">
                <strong className="w-32 text-gray-700">Type:</strong>
                <span>{detailBanner.type || 'N/A'}</span>
            </div>
        </div>
    </div>
    );
};

export default DetailBanner;
