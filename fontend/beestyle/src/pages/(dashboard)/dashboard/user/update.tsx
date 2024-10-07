import React, { useState } from 'react';

type Props = {}

const UpdateUser = (props: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
        Cập nhật tài khoản mới
      </h1>

      <form>
        <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6 overflow-hidden transition-colors duration-300`}>
          <div className={`p-4 rounded-t-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} transition-colors duration-300`}>
            <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-blue-800'} transition-colors duration-300`}>
              Thông tin người dùng
            </h4>
          </div>
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>

            {/* Tên người dùng */}
            <div className="mb-4">
              <label htmlFor="name" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                Tên người dùng
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Ngày sinh */}
            <div className="mb-4">
              <label htmlFor="date_of_birth" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                Ngày sinh
              </label>
              <input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Giới tính */}
            <div className="mb-4">
              <label
                htmlFor="sex"
                className={`block font-medium ${darkMode ? "text-white" : "text-gray-700"
                  } transition-colors duration-300`}
              >
                Giới tính
              </label>
              <select
                id="sex"
                name="sex"
                className={`mt-1 block w-full border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-700"
                  } rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Mật khẩu */}
            <div className="mb-4">
              <label htmlFor="password" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
              />
            </div>

            {/* Tên nhà cung cấp */}
            {/* <div className="mb-4">
              <label htmlFor="provider_name" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                Tên nhà cung cấp
              </label>
              <input
                type="text"
                name="provider_name"
                id="provider_name"
                className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
              />
            </div> */}
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

export default UpdateUser;
