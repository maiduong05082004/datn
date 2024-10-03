import React, { useState } from 'react';

const UpdateProductForm = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Cập nhật sản phẩm mới
      </h1>
      <form>
        <div className={`shadow-lg rounded-lg mb-6 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className={`p-4 rounded-t-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
            <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-blue-800'}`}>Thông tin sản phẩm</h4>
          </div>
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {/* Slug */}
            <div className="mb-4">
              <label htmlFor="slug" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                maxLength={255}
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* Tên sản phẩm */}
            <div className="mb-4">
              <label htmlFor="name_product" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Tên sản phẩm</label>
              <input
                type="text"
                id="name_product"
                name="name_product"
                maxLength={255}
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* Giá sản phẩm */}
            <div className="mb-4">
              <label htmlFor="price" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Giá sản phẩm</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* Số lượng trong kho */}
            <div className="mb-4">
              <label htmlFor="stock" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Số lượng trong kho</label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* Mô tả */}
            <div className="mb-4">
              <label htmlFor="description" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Mô tả</label>
              <input
                type="text"
                id="description"
                name="description"
                maxLength={255}
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* Nội dung chi tiết */}
            <div className="mb-4">
              <label htmlFor="content" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Nội dung chi tiết</label>
              <textarea
                id="content"
                name="content"
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              ></textarea>
            </div>

            {/* Lượt xem */}
            <div className="mb-4">
              <label htmlFor="view" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Lượt xem</label>
              <input
                type="number"
                id="view"
                name="view"
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* ID danh mục */}
            <div className="mb-4">
              <label htmlFor="category_id" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>ID danh mục</label>
              <input
                type="number"
                id="category_id"
                name="category_id"
                required
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            {/* Checkbox cho các loại sản phẩm */}
            <div className="grid grid-cols-2 gap-4">
              {/* Loại sản phẩm */}
              <div className="mb-4">
                <label htmlFor="is_type" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Loại sản phẩm</label>
                <input
                  type="checkbox"
                  id="is_type"
                  name="is_type"
                  className={`h-5 w-5 border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
              {/* Sản phẩm hot */}
              <div className="mb-4">
                <label htmlFor="is_hot" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Sản phẩm hot</label>
                <input
                  type="checkbox"
                  id="is_hot"
                  name="is_hot"
                  className={`h-5 w-5 border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
              {/* Hot deal */}
              <div className="mb-4">
                <label htmlFor="is_hot_deal" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Hot deal</label>
                <input
                  type="checkbox"
                  id="is_hot_deal"
                  name="is_hot_deal"
                  className={`h-5 w-5 border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
              {/* Sản phẩm mới */}
              <div className="mb-4">
                <label htmlFor="is_new" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Sản phẩm mới</label>
                <input
                  type="checkbox"
                  id="is_new"
                  name="is_new"
                  className={`h-5 w-5 border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
              {/* Hiển thị trên trang chủ */}
              <div className="mb-4">
                <label htmlFor="is_show_home" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Hiển thị trên trang chủ</label>
                <input
                  type="checkbox"
                  id="is_show_home"
                  name="is_show_home"
                  className={`h-5 w-5 border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateProductForm;
