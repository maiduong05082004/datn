import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
  return response.data;
};

const updateCategory = async (categoryData: Category): Promise<any> => {
  const response = await fetch(`http://127.0.0.1:8000/api/admins/categories/${categoryData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

const UpdateCategories = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [isActive, setIsActive] = useState(false);

  const { data: categories } = useQuery<Category[]>('categories', fetchCategories);

  const mutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      alert('Cập nhật thành công');
      resetForm();
    },
    onError: (error: Error) => {
      alert(`Có lỗi xảy ra: ${error.message}`);
    },
  });

  const resetForm = () => {
    setName('');
    setParentId('');
    setIsActive(false);
    setSelectedCategory(null);
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedCategory) {
      mutation.mutate({ ...selectedCategory, name, parent_id: parentId, status: isActive });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);
    const category = categories?.find(cat => cat.id === categoryId) || null;

    if (category) {
      setSelectedCategory(category);
      setName(category.name);
      setParentId(String(category.parent_id || ''));
      setIsActive(category.status);
    } else {
      resetForm();
    }
  };

  const renderCategories = (categories: Category[], indent: string = '') => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <option key={category.id} value={category.id}>
          {indent} {category.name}
        </option>
        {category.children_recursive.length > 0 && renderCategories(category.children_recursive, indent + '-')}
      </React.Fragment>
    ));
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Cập nhật danh mục
      </h1>
      <div className="mb-4">
        <label htmlFor="categorySelect" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Chọn danh mục để cập nhật</label>
        <select
          id="categorySelect"
          onChange={handleSelectChange}
          className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
        >
          <option value="">Chọn danh mục</option>
          {categories && renderCategories(categories)}
        </select>
      </div>

      {selectedCategory && (
        <form onSubmit={handleUpdateSubmit}>
          <div className={`shadow-lg rounded-lg mb-6 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className={`p-4 rounded-t-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
              <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-blue-800'}`}>Thông tin danh mục</h4>
            </div>
            <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              {/* Tên danh mục */}
              <div className="mb-4">
                <label htmlFor="name" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Tên danh mục</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  required
                />
              </div>

              {/* Danh mục cha */}
              <div className="mb-4">
                <label htmlFor="parent_id" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Danh mục cha</label>
                <select
                  name="parent_id"
                  id="parent_id"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                >
                  <option value="">Chọn danh mục cha</option>
                  {categories && renderCategories(categories)}
                </select>
              </div>

              {/* Trạng thái */}
              <div className="mb-4 flex items-center">
                <label htmlFor="status" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Trạng thái</label>
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className={`ml-2 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                />
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cập nhật
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateCategories;
