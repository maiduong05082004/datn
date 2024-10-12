import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

// Khai báo type cho dữ liệu Category
type Category = {
  id: number;
  parent_id: number | null;
  image: string | null;
  name: string;
  status: boolean;
  created_at: string | null;
  updated_at: string | null;
  children_recursive: Category[];
};

// Hàm fetch dữ liệu từ API
const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
  return response.data;
};

const ListCategories = () => {
  // Sử dụng useQuery để gọi API
  const { data, error, isLoading } = useQuery<Category[]>('categories', fetchCategories);

  if (isLoading) {
    return <div>Đang tải danh mục...</div>;
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải danh mục!</div>;
  }

  const renderSubcategories = (subcategories: Category[]) => {
    return subcategories.map(subcategory => (
      <div key={subcategory.id} className="ml-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">{subcategory.name}</button>
        {/* {subcategory.children_recursive && subcategory.children_recursive.length > 0 && (
          <div className="flex space-x-2">{renderSubcategories(subcategory.children_recursive)}</div>
        )} */}
      </div>
    ));
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Danh sách Danh mục</h3>
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-md mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-800 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-center">ID</th>
              <th className="py-3 px-4 text-center">Tên danh mục</th>
              <th className="py-3 px-4 text-center">Danh mục con</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((category) => (
              <tr key={category.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-center text-black dark:text-white">{category.id}</td>
                <td className="py-3 px-4 text-center text-black dark:text-white">{category.name}</td>
                <td className="py-3 px-4 text-center text-black dark:text-white flex justify-center space-x-2">
                  {category.children_recursive.length > 0 ? (
                    renderSubcategories(category.children_recursive)
                  ) : (
                    'Không có danh mục con'
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ListCategories;
