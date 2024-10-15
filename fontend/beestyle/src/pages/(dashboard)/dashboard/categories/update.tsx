import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Nhập useNavigate và useLocation

interface CategoryData {
  name: string;
  parent_id: number | null;
  status: boolean;
}

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

const updateCategory = async (categoryId: number, categoryData: CategoryData): Promise<any> => {
  const response = await fetch(`http://127.0.0.1:8000/api/admins/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error updating category: ${errorText}`); // Ghi log lỗi
    throw new Error(`Server error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
  return response.data;
};

const UpdateCategories = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Lấy state từ navigate
  const category = state?.category; // Lấy danh mục từ state

  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  const { data: categoriesData, error } = useQuery<Category[]>('categories', fetchCategories);

  const mutation = useMutation({
    mutationFn: (categoryData: CategoryData) => updateCategory(category.id, categoryData),
    onSuccess: () => {
      alert('Cập nhật thành công');
      navigate('/admin/listCategories', { replace: true }); // Xóa trạng thái sau khi điều hướng
    },
    onError: (error: Error) => {
      alert(`Có lỗi xảy ra: ${error.message}`);
    },
  });


  // Set dữ liệu ban đầu khi có danh mục
  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parent_id);
      setIsActive(category.status);
    } else {
      navigate('/admin/updateCategories'); // Điều hướng về danh sách nếu không có danh mục
    }
  }, [category, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const categoryData = { name, parent_id: parentId, status: isActive };
    console.log('Updating category with data:', categoryData); // Kiểm tra dữ liệu
    mutation.mutate(categoryData);
  };

  const renderCategories = (categories: Category[], indent: string = '') => {
    return categories.map((cat) => (
      <React.Fragment key={cat.id}>
        <option value={cat.id}>
          {indent} {cat.name}
        </option>
        {cat.children_recursive.length > 0 && renderCategories(cat.children_recursive, indent + '-')}
      </React.Fragment>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Cập nhật danh mục</h1>
      <form onSubmit={handleSubmit}>
        <div className="shadow-lg rounded-lg mb-6 overflow-hidden bg-white">
          <div className="p-4 bg-blue-100">
            <h4 className="text-lg font-semibold text-blue-800">Thông tin danh mục</h4>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium text-gray-700">Tên danh mục</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="parent_id" className="block font-medium text-gray-700">Danh mục cha</label>
              <select
                name="parent_id"
                id="parent_id"
                value={parentId ?? ''}
                onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục cha</option>
                {categoriesData && renderCategories(categoriesData)}
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <label htmlFor="status" className="block font-medium text-gray-700">Trạng thái</label>
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="ml-2 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="ml-2">{isActive ? 'Hoạt động' : 'Không hoạt động'}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-4"> {/* Khoảng cách giữa các button */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Thêm mới
          </button>
          <button
            onClick={() => navigate('/admin/listCategories')} // Chuyển hướng về trang danh sách
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategories;
