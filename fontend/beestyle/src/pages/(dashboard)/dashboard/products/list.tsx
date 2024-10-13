import { Mutation, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { format } from 'date-fns';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
  input_day: string;
  group: {
    name: string;
  } | null;
  variations: Variation[];
}

interface Variation {
  id: number;
  stock: number;
  attribute_value_image_variant: {
    value: string;
    image_path: string;
  };
  variation_values: VariationValue[];
  variation_album_images: string[];
}

interface VariationValue {
  attribute_value_id: number;
  value: string;
  price: string;
  discount: number;
}

type Props = {}

const ListProducts = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admins/products`);
        return response.data;
      } catch (error) {
        message.error('Lỗi khi lấy danh sách sản phẩm');
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await axios.delete(`http://localhost:8000/api/admins/products/${id}`);
      } catch (error) {
        throw new Error(`Xóa sản phẩm thất bại`);
      }
    },
    onSuccess: () => {
      messageApi.open({
        content: 'Xóa thành công',
        type: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      messageApi.error({
        type: "error",
        content: error.message,
      });
    }
  });

  if (isLoadingProducts) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-lg font-semibold text-gray-600">Đang tải dữ liệu...</div>
    </div>;
  }

  return (
    <>
      {contextHolder}
      <div className="w-full max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold text-center pb-10 text-indigo-600">Quản Lý Sản Phẩm</h2>
        <div className="overflow-x-auto w-full bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Giá</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mô tả</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Ngày nhập</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Biến thể</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productsData?.data?.map((product: Product, index: number) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-200 ease-in-out transform">
                  <td className="px-4 py-4 text-sm text-gray-900 font-semibold">{index + 1}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{product.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 font-medium">{product.name}</td>
                  <td className="py-4 px-4 text-sm text-green-600 font-semibold">
                    {parseFloat(product.price).toLocaleString()} VND
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{product.stock}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-sm truncate">
                    <div className="text-xs w-[100px]">{product.description}</div>
                    <button className="ml-2 text-indigo-600 hover:underline" onClick={() => alert(product.description)}>
                      Xem thêm
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{format(new Date(product.input_day), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-block bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full">
                      {product.group?.name || 'Không có danh mục'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {product.variations.map((variant: Variation) => (
                      <div key={variant.id} className="mb-4 p-2 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-indigo-700">Màu sắc: {variant.attribute_value_image_variant.value}</span>
                        <img
                          src={variant.attribute_value_image_variant.image_path}
                          alt={variant.attribute_value_image_variant.value}
                          className="w-16 h-16 object-cover rounded-lg mt-2 border border-gray-300"
                        />
                        <div className="flex flex-col mt-2 space-y-1">
                          {variant.variation_values.map((value: VariationValue) => (
                            <div key={value.attribute_value_id} className="flex justify-between p-2 bg-white shadow-sm rounded-lg">
                              <span className="text-sm font-medium">{value.value}</span>
                              <div className="text-right">
                                <span className="text-sm font-semibold text-gray-700">{parseFloat(value.price).toLocaleString()} VND</span>
                                {value.discount > 0 && (
                                  <span className="text-sm text-red-500 font-semibold">-{value.discount}%</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4">
                    {product.variations[0]?.variation_album_images?.length > 0 ? (
                      <img
                        src={product.variations[0].variation_album_images[0]}
                        alt={product.name}
                        className="w-[200px] object-cover rounded-lg border border-gray-300 hover:scale-105 transform transition duration-200 ease-in-out"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-300">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => mutation.mutate(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {productsData?.data?.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-gray-500">Không có sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>

  );
};

export default ListProducts;
