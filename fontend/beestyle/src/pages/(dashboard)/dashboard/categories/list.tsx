import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Category = {
  id: number;
  name: string;
  status: boolean; // Trạng thái của danh mục
  children_recursive: Category[];
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
  return response.data;
};

const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`http://127.0.0.1:8000/api/admins/categories/${id}`);
};
  
const ListCategories = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<Category[]>('categories', fetchCategories);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleExpand = (id: number) => {
    if (expandedCategory === id) {
      setExpandedCategory(null);
      setExpandedSubCategory(null); // Đóng danh mục con khi danh mục cha đóng
    } else {
      setExpandedCategory(id);
      setExpandedSubCategory(null); // Đóng danh mục con trước đó nếu có
    }
  };

  const toggleExpandSubCategory = (id: number) => {
    setExpandedSubCategory((prev) => (prev === id ? null : id)); // Chỉ mở danh mục con mới
  };

  const mutation = useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
      setNotification('Đã xóa danh mục thành công!');
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error: Error) => {
      alert(`Có lỗi xảy ra khi xóa danh mục: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      mutation.mutate(id);
    }
  };

  const renderSubCategories = (subCategories: Category[]) => {
    return (
      <table className="min-w-full bg-gray-100 rounded-lg shadow-md overflow-hidden">
        <tbody>
          {subCategories.map((subCategory) => (
            <React.Fragment key={subCategory.id}>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-center text-black">{subCategory.id}</td>
                <td className="py-3 px-4 text-center text-black">{subCategory.name}</td>
                <td className="py-3 px-4 text-center text-black">
                  {subCategory.children_recursive.length > 0 ? (
                    <button
                      className="text-blue-600 underline"
                      // onClick={() => toggleExpandSubCategory(subCategory.id)}
                    >
                      Danh mục con
                    </button>
                  ) : (
                    <span className="text-gray-500">Không có danh mục con</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center text-black">
                  {subCategory.status ? (
                    <span className="text-green-600">Hoạt động</span>
                  ) : (
                    <span className="text-red-600">Ngừng hoạt động</span>
                  )}
                </td>
                <td className="py-3 px-6 text-center text-black flex justify-center space-x-4">
                  <button
                    className="text-green-700 flex items-center"
                    onClick={() => navigate('/admin/updateCategories', { state: { category: subCategory } })}
                  >
                    Sửa
                    <i className="fas fa-edit ml-1"></i>
                  </button>
                  <button
                    className="text-red-700 flex items-center"
                    onClick={() => handleDelete(subCategory.id)}
                  >
                    Xóa
                    <i className="fas fa-trash-alt ml-1"></i>
                  </button>
                </td>
              </tr>
              {expandedSubCategory === subCategory.id && subCategory.children_recursive.length > 0 && (
                <tr>
                  <td colSpan={5} className="pl-10">
                    {renderSubCategories(subCategory.children_recursive)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  if (isLoading) {
    return <div className="text-center">Đang tải danh mục...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Đã xảy ra lỗi khi tải danh mục!</div>;
  }

  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg mt-4">
      <h3 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Danh sách Danh mục</h3>
      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-800 p-4 rounded-md text-center mb-4 z-50">
          {notification}
        </div>
      )}
      <div className="flex justify-between mb-4">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => navigate('/admin/addCategories')}
        >
          Thêm danh mục mới
        </button>
        <button
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onClick={() => navigate('/admin/trashCategories')} // Điều hướng đến trang Thùng rác
        >
          Xem Thùng rác
        </button>
      </div>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-800 dark:bg-gray-900 text-white">
          <tr>
            <th className="py-3 px-4 text-center">ID</th>
            <th className="py-3 px-4 text-center">Tên danh mục</th>
            <th className="py-3 px-4 text-center">Quản lý danh mục con</th>
            <th className="py-3 px-4 text-center">Trạng thái</th> {/* Cột Trạng thái */}
            <th className="py-3 px-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((category) => (
            <React.Fragment key={category.id}>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-center text-black dark:text-white">{category.id}</td>
                <td className="py-3 px-4 text-center text-black dark:text-white">{category.name}</td>
                <td className="py-3 px-4 text-center text-black dark:text-white">
                {category.children_recursive.length > 0 ? (
                  <button
                    className="text-blue-600 underline"
                    onClick={() => navigate('/admin/subCategories', { state: { category } })}
                  >
                    Danh mục con ({category.children_recursive.length})
                  </button>
                ) : (
                  <span className="text-gray-500">Không có danh mục con</span>
                )}
              </td>

                <td className="py-3 px-4 text-center text-black dark:text-white">
                  {category.status ? (
                    <span className="text-green-600">Hoạt động</span>
                  ) : (
                    <span className="text-red-600">Ngừng hoạt động</span>
                  )}
                </td>
                <td className="py-3 px-6 text-center text-black dark:text-white flex justify-center space-x-4">
                  <button
                    className="text-green-700 flex items-center"
                    onClick={() => navigate('/admin/updateCategories', { state: { category } })}
                  >
                    Sửa
                    <i className="fas fa-edit ml-1"></i>
                  </button>
                  <button
                    className="text-red-700 flex items-center"
                    onClick={() => handleDelete(category.id)}
                  >
                    Xóa
                    <i className="fas fa-trash-alt ml-1"></i>
                  </button>
                </td>
              </tr>
              {expandedCategory === category.id && category.children_recursive.length > 0 && (
                <tr>
                  <td colSpan={5} className="pl-10">
                    {renderSubCategories(category.children_recursive)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCategories;
