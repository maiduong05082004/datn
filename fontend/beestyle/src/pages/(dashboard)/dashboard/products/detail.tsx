import { useQuery } from '@tanstack/react-query';
import { Image, Typography, Button, Badge, Divider } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

const { Title, Text, Paragraph } = Typography;

const DetailProduct = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['detailProducts'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/products');
      return response?.data?.data || [];
    },
  });

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0); // Theo dõi biến thể được chọn
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Theo dõi ảnh được chọn

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  if (isError || data.length === 0) {
    return <div className="text-center text-red-500">Không tìm thấy sản phẩm!</div>;
  }

  const product = data[0];
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
  } = product;

  const selectedVariation = variations[selectedVariantIndex]; // Biến thể hiện tại

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Album ảnh của biến thể */}
        <div className="col-span-1 flex gap-4">
          {/* Ảnh nhỏ theo chiều dọc */}
          <div className="flex flex-col gap-2">
            {selectedVariation.variation_album_images.map((img: string, index: number) => (
              <div
                key={index}
                className={`w-20 h-20 overflow-hidden rounded-md border cursor-pointer ${
                  index === selectedImageIndex ? 'border-black' : 'border-gray-300'
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image src={img} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>

          {/* Ảnh lớn */}
          <div className="h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={selectedVariation.variation_album_images[selectedImageIndex]}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="lg:col-span-2">
          <Title level={2}>{name}</Title>
          <Text className="text-gray-600">Danh mục: {category_name}</Text>
          <Text className="text-gray-600 block">Ngày nhập: {input_day}</Text>

          <Text className="text-2xl font-bold text-red-600 mt-2">
            {parseFloat(price).toLocaleString()} VND
          </Text>

          {/* Thẻ đánh dấu */}
          <div className="flex gap-2 mt-2">
            {is_new && <Badge.Ribbon text="Sản phẩm mới" color="green" />}
            {is_hot && <Badge.Ribbon text="Hot" color="red" />}
            {is_collection && <Badge.Ribbon text="Bộ sưu tập" color="blue" />}
          </div>

          <Divider />

          {/* Nội dung chi tiết */}
          <Paragraph className="text-lg">{description}</Paragraph>
          <Paragraph className="text-gray-600">{content}</Paragraph>

          {/* Tùy chọn màu sắc */}
          <div className="mt-6">
            <h4 className="font-semibold text-lg">Màu sắc</h4>
            <div className="flex gap-2 mt-2">
              {variations.map((variation: any, index: number) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 ${
                    index === selectedVariantIndex ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: variation.attribute_value_image_variant.value }}
                  onClick={() => setSelectedVariantIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Tùy chọn kích thước */}
          <div className="mt-6">
            <h4 className="font-semibold text-lg">Kích thước</h4>
            <div className="flex gap-2 mt-2">
              {selectedVariation.variation_values.map((value: any, index: number) => (
                <button
                  key={index}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:border-black"
                >
                  {value.value}
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* Thông tin tồn kho */}
          <Text className="block text-lg">
            Tồn kho: {stock} sản phẩm (Biến thể: {selectedVariation.stock})
          </Text>

          {/* Nút hành động */}
          <div className="flex gap-4 mt-8">
            <Button type="primary" className="w-full py-3 text-lg bg-black text-white">
              Thêm vào giỏ
            </Button>
            <Button className="w-full py-3 text-lg bg-red-600 text-white">Mua ngay</Button>
          </div>

          {/* Nhóm biến thể */}
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h4 className="font-semibold">Nhóm biến thể</h4>
            <Text>{group.name}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
