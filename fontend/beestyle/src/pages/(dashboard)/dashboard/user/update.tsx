import React from 'react'

type Props = {}

const UpdateUser = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">Cập nhật người dùng</h3>
        {/* Thông tin người dùng */}
        <div className="bg-gray-100 p-6 rounded-md mb-6">
          <h4 className="text-lg font-medium mb-4">Thông tin người dùng</h4>
          <form className="space-y-6">
            {/* Tên */}
            <div className="mb-4 w-full">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Tên</label>
              <input
                type="text"
                id="name"
                name="name"
                maxLength={255}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Ngày sinh */}
            <div className="mb-4 w-full">
              <label htmlFor="date_of_birth" className="block text-gray-700 font-medium mb-2">Ngày sinh</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Giới tính */}
            <div className="mb-4 w-full">
              <label htmlFor="sex" className="block text-gray-700 font-medium mb-2">Giới tính</label>
              <select
                id="sex"
                name="sex"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            {/* Email */}
            <div className="mb-4 w-full">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                maxLength={255}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Mật khẩu */}
            <div className="mb-4 w-full">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                maxLength={255}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Nhà cung cấp */}
            <div className="mb-4 w-full">
              <label htmlFor="provider_name" className="block text-gray-700 font-medium mb-2">Nhà cung cấp</label>
              <input
                type="text"
                id="provider_name"
                name="provider_name"
                maxLength={255}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Nút Lưu */}
            <div className="w-full">
            <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Lưu thông tin
        </button>
            </div>
          </form>
        </div>
      </div>
      
      
    )
}

export default UpdateUser