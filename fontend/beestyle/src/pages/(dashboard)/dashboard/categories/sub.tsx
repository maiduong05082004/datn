import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

type Category = {
  id: number;
  name: string;
  status: boolean;
  children_recursive: Category[];
};

const deleteCategory = async (id: number) => {
  const response = await axios.delete(`http://127.0.0.1:8000/api/admins/categories/${id}`);
  return response.data;
};

const SubCategories = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state as { category: Category };
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      alert('Xóa thành công');
      queryClient.invalidateQueries('categories');
      navigate(-1);
    },
    onError: () => {
      alert('Có lỗi xảy ra khi xóa');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg mt-4">
      <h3 className="text-2xl font-bold text-center text-black dark:text-white">
        Danh mục con của {category.name}
      </h3>
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => navigate('/admin/addSub', { state: {category} })}
        >
          Thêm danh mục con
        </button>
        <button
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onClick={() => navigate('/admin/trashCategories')} // Điều hướng đến trang Thùng rác
        >
          Xem Thùng rác
        </button>
      </div>
      {category.children_recursive.length > 0 ? (
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-800 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-center">ID</th>
              <th className="py-3 px-4 text-center">Tên danh mục</th>
              <th className="py-3 px-4 text-center">Quản lý danh mục con</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {category.children_recursive.map((subCategory) => (
              <tr key={subCategory.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-center text-black dark:text-white">{subCategory.id}</td>
                <td className="py-3 px-4 text-center text-black dark:text-white">{subCategory.name}</td>
                <td className="py-3 px-4 text-center text-black dark:text-white">
                  {subCategory.children_recursive.length > 0 ? (
                    <button
                      className="text-blue-600 underline"
                      onClick={() => navigate('/admin/subCategories', { state: { category: subCategory } })}
                    >
                      Danh mục con ({subCategory.children_recursive.length})
                    </button>
                  ) : (
                    <span className="text-gray-500">Không có danh mục con</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center text-black dark:text-white">
                  {subCategory.status ? (
                    <span className="text-green-600">Hoạt động</span>
                  ) : (
                    <span className="text-red-600">Ngừng hoạt động</span>
                  )}
                </td>
                <td className="py-3 px-6 text-center text-black dark:text-white flex justify-center space-x-4">
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
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500">Không có danh mục con</div>
      )}
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
    </div>
  );
};

export default SubCategories;
