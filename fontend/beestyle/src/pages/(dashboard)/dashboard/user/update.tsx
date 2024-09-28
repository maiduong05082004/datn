import React from 'react'

type Props = {}

const UpdateUser = (props: Props) => {
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Cập nhật tài khoản</h2>
        <form action="/submit" method="POST">
          
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Tên:</label>
                <input type="text" name="name" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
            </div>
            
            <div className="mb-4">
                <label htmlFor="date_of_birth" className="block text-gray-700 font-bold mb-2">Ngày sinh:</label>
                <input type="date" name="date_of_birth" id="date_of_birth" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            
            <div className="mb-4">
                <label htmlFor="sex" className="block text-gray-700 font-bold mb-2">Giới tính:</label>
                <select name="sex" id="sex" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                </select>
            </div>
           
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
                <input type="email" name="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
            </div>
            
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Mật khẩu:</label>
                <input type="password" name="password" id="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
            </div>
           
            <div className="mb-4">
                <label htmlFor="provider_name" className="block text-gray-700 font-bold mb-2">Tên nhà cung cấp:</label>
                <input type="text" name="provider_name" id="provider_name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} />
            </div>
            
            <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                Gửi
            </button>
        </form>
    </div>
    )
}

export default UpdateUser