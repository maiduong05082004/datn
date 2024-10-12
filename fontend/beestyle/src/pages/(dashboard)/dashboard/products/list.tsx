import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { format } from 'date-fns';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  input_day: string;
  category: {
    name: string;
  };
  variations: Variation[];
}

interface Variation {
  id: number;
  attribute_value: {
    value: string;
  };
  variation_values: VariationValue[];
}

interface VariationValue {
  attribute_value_id: number;
  value: string;
  price: number;
  discount: number;
}

type Props = {}

const ListProducts = (props: Props) => {
  // Fetch products
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

  // Fetch categories with hierarchy
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/categories');
      return response.data; // Categories with hierarchy
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/admins/products/${id}`);
      message.success('Sản phẩm đã được xóa thành công');
    } catch (error) {
      message.error('Lỗi khi xóa sản phẩm');
    }
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="loading-container">Loading...</div>
  }

  // Hàm tìm kiếm tên danh mục từ danh sách danh mục với cấu trúc phân cấp
  const findCategoryNames = (categories: any[], categoryId: number): string => {
    const categoryNames: string[] = [];
    const findCategory = (categories: any[]) => {
      for (const category of categories) {
        if (category.id === categoryId) {
          categoryNames.push(category.name); // Add the current category name
          return true; // Found the category
        }
        if (category.children_recursive && category.children_recursive.length > 0) {
          if (findCategory(category.children_recursive)) {
            categoryNames.unshift(category.name); // Add parent category name
            return true; // Stop searching
          }
        }
      }
      return false; // Not found
    };
    findCategory(categories);
    return categoryNames.join(' > '); // Return names in parent to child order
  };

  return (
    <div className="w-full px-6 py-10">
      <h2 className="text-4xl font-bold text-center pb-10 text-indigo-600">Quản Lý Sản Phẩm</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">STT</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Tên sản phẩm</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Giá</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Tồn kho</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Mô tả</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Ngày nhập</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Danh mục</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Biến thể</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Hình ảnh</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productsData?.data.map((product: any, index: number) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="py-4 px-4 text-sm text-gray-700">{product.id}</td>
                <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{product.name}</td>
                <td className="py-4 px-4 text-sm text-green-600 font-semibold">
                  {parseFloat(product.price).toLocaleString()} VND
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{product.stock}</td>
                <td className="py-4 px-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <div className="max-w-xs overflow-hidden">
                    <p className="line-clamp-3">{product.description}</p>
                    <button
                      className="mt-2 text-indigo-600 hover:underline"
                      onClick={() => alert(product.description)} 
                    >
                      Xem thêm
                    </button>
                  </div>
                </td>


                <td className="py-4 px-4 text-sm text-gray-700">{format(new Date(product.input_day), 'dd/MM/yyyy')}</td>
                {/* Danh mục */}
                <td className="py-4 px-4 text-sm">
                  <span className="inline-block bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full shadow">
                    {findCategoryNames(categoriesData, product.category_id) || 'Không có danh mục'}
                  </span>
                </td>

                <td className="py-4 px-4 text-sm text-gray-700">
                  {product.variations.map((variant: any) => (
                    <div key={variant.id} className="mb-4 p-3 bg-gray-100 rounded-lg shadow-inner">
                      <span className="font-semibold text-indigo-800">Màu sắc: {variant.attribute_value.value}</span>
                      <div className="flex flex-col mt-2 space-y-1">
                        {variant.variation_values.map((value: any) => (
                          <div key={value.attribute_value_id} className="flex justify-between items-center p-2 bg-white shadow rounded-lg">
                            <span className="font-medium">{value.value}</span>
                            <div className="text-right">
                              <span className="block text-gray-700 font-semibold">{parseFloat(value.price).toLocaleString()} VND</span>
                              {value.discount > 0 && (
                                <span className="block text-red-500 font-semibold">-{value.discount}%</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </td>

                {/* Hình ảnh */}
                <td className="py-4 px-4">
                  {product.variations[0]?.variation_images?.length > 0 ? (
                    <img
                      src={`/path_to_default_image_folder/${product.variations[0].variation_images[0].image_path}`}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300 hover:scale-105 transform transition duration-300 ease-in-out"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 text-center flex items-center justify-center rounded-lg border border-gray-300">
                      <span className="text-sm text-gray-500">No Image</span>
                    </div>
                  )}
                </td>

                {/* Hành động */}
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all hover:bg-red-600 focus:outline-none"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListProducts;
