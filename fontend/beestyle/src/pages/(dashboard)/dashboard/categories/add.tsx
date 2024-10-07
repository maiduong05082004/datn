import React, { useState } from 'react';

const AddCategories = () => {

  const [darkMode, setDarkMode] = useState(false); // false = Light Mode by default
  const [isActive, setIsActive] = useState(false); // Trạng thái của checkbox

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(e.target.checked); // Cập nhật trạng thái của checkbox
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Thêm mới danh mục
      </h1>
      <form>
        <div className={`shadow-lg rounded-lg mb-6 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className={`p-4 rounded-t-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-blue-800'}`}>Thông tin danh mục</h4>
          </div>
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Tên danh mục</label>
              <input
                type="text"
                name="name"
                id="name"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                required
              />
            </div>

            {/* Parent ID */}
            <div className="mb-4">
              <label htmlFor="parent_id" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Danh mục cha</label>
              {/* <input
                type="number"
                name="parent_id"
                id="parent_id"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              /> */}
              <select
                name="parent_id"
                id="parent_id"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              >
                <option value="">Chọn danh mục cha</option> {/* Option mặc định */}
                <option value="1">Danh mục cha 1</option>
                <option value="2">Danh mục cha 2</option>
                <option value="3">Danh mục cha 3</option>
              </select>

            </div>

            {/* Status */}
            <div className="mb-4 flex items-center">
              <label htmlFor="status" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Trạng thái</label>
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={isActive}
                onChange={handleStatusChange}
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
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Thêm mới
        </button>
      </form>
    </div>
  );
};
export default AddCategories;
