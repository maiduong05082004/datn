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
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 border-b pb-4">Chi tiết Banner</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hình ảnh chính */}
            <div className="md:col-span-1 flex justify-center">
              <img
                src={detailBanner.image_path}
                alt="Banner"
                className="w-full h-64 object-cover rounded-lg shadow-md border"
              />
            </div>
      
            {/* Thông tin chi tiết */}
            <div className="md:col-span-2 space-y-6">
              {/* ID */}
              <div className="flex items-center">
                <strong className="w-40 text-gray-700">ID:</strong>
                <span className="text-gray-900">{detailBanner.id}</span>
              </div>
      
              {/* Danh mục */}
              <div className="flex items-center">
                <strong className="w-40 text-gray-700">Danh mục:</strong>
                <span className="text-gray-900">
                  {categoryMap[detailBanner.category_id] || "N/A"}
                </span>
              </div>
      
              {/* Tiêu đề */}
              <div className="flex items-center">
                <strong className="w-40 text-gray-700">Tiêu đề:</strong>
                <span className="text-gray-900">{detailBanner.title}</span>
              </div>
      
              {/* Đường dẫn */}
              <div className="flex items-center">
                <strong className="w-40 text-gray-700">Đường dẫn:</strong>
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
                <strong className="w-40 text-gray-700">Loại:</strong>
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
