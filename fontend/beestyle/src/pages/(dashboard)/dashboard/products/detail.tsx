import { useQuery } from '@tanstack/react-query';
import { Image, Typography, Button, Badge, Divider, message } from 'antd';
import AxiosInstance from '@/configs/axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const DetailProduct = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0); // Chọn biến thể
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Chọn ảnh trong album

  const { data, isLoading, isError } = useQuery({
    queryKey: ['detailProduct', id],
    queryFn: async () => {
      const response = await AxiosInstance.get(`http://localhost:8000/api/admins/products/${id}`);
      return response?.data?.data || {};
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  if (isError || !data) {
    return <div className="text-center text-red-500">Không tìm thấy sản phẩm!</div>;
  }

  const product = data;
  const {
    name,
    price,
    stock,
    description,
    content,
    input_day,
    category_name,
    is_collection,
    is_hot,
    is_new,
    group,
    variations,
    slug,
    images,
  } = product;

  const selectedVariation = variations[selectedVariantIndex] || {};

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="col-span-1 flex gap-4">
          {/* Album ảnh của biến thể */}
          <div className="flex flex-col gap-4">
            {selectedVariation.variation_album_images?.map((img: string, index: number) => (
              <div
                key={index}
                className={`w-20 h-20 overflow-hidden rounded-lg border cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${
                  index === selectedImageIndex ? 'border-blue-600 shadow-lg' : 'border-gray-300'
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image src={img} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>

          {/* Ảnh lớn */}
          <div className="h-80 w-full overflow-hidden rounded-xl shadow-lg border border-gray-300">
            <Image
              src={selectedVariation.variation_album_images?.[selectedImageIndex]}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="lg:col-span-2">
          <Title level={2} className="text-3xl font-bold text-gray-800 mb-4">{name}</Title>
          <Text className="text-base text-gray-600 block mb-2">Danh mục: {category_name}</Text>
          <Text className="text-base text-gray-600 block mb-4">Ngày nhập: {input_day}</Text>
          <Text className="text-base text-gray-600 block mb-4">Slug: {slug}</Text>

          <Text className="text-2xl font-bold text-red-600 mb-6">
            {parseFloat(price).toLocaleString()} VND
          </Text>

          <div className="flex gap-4 mb-6">
            {is_new && <Badge.Ribbon text="Sản phẩm mới" color="green" />}
            {is_hot && <Badge.Ribbon text="Hot" color="red" />}
            {is_collection && <Badge.Ribbon text="Bộ sưu tập" color="blue" />}
          </div>

          <Divider className="my-8" />

          {/* Thông tin biến thể */}
          {group && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-300 mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Nhóm biến thể</h4>
              <Text className="text-gray-700 text-base">{group.name}</Text>
            </div>
          )}

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Màu sắc</h4>
            <div className="flex flex-wrap gap-3">
              {variations.map((variation: any, index: number) => (
                <div
                  key={index}
                  className={`relative p-0.5 rounded-full border-2 ${
                    index === selectedVariantIndex ? 'border-blue-500 shadow-md' : 'border-gray-300'
                  } cursor-pointer transition-transform duration-300 hover:scale-105`}
                  onClick={() => setSelectedVariantIndex(index)}
                >
                  <img
                    src={variation.attribute_value_image_variant.image_path}
                    alt={variation.attribute_value_image_variant.value}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Kích thước</h4>
            <div className="flex flex-wrap gap-3">
              {selectedVariation.variation_values?.map((value: any, index: number) => (
                <button
                  key={index}
                  className="w-20 h-10 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-300 hover:border-blue-500 hover:shadow-md"
                >
                  {value.value}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Text className="text-lg text-gray-800">
              Tồn kho: <span className="font-semibold">{stock}</span> sản phẩm (Biến thể:
              <span className="font-semibold"> {selectedVariation.stock}</span>)
            </Text>
          </div>

          {/* Mô tả và nội dung sản phẩm */}
          <div className="mt-8 p-8 bg-white shadow-xl rounded-lg border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-4 mb-6">
              Mô tả
            </h2>
            <Paragraph className="text-base leading-relaxed text-gray-700 mb-8">
              {description}
            </Paragraph>

            <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-4 mb-6">
              Nội dung
            </h2>
            <Paragraph className="text-base leading-relaxed text-gray-600">
              {content}
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
