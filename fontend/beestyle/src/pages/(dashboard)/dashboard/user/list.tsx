import React, { useState } from 'react';

type Props = {}

const ListUser = (props: Props) => {

    const [darkMode, setDarkMode] = useState(false); // Chế độ tối mặc định là false (chế độ sáng)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`w-full mx-auto p-6 rounded-lg shadow-lg mt-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-black'}`}>
                Danh sách tài khoản
            </h3>
            <div className={`bg-gray-100 ${darkMode ? 'dark:bg-gray-700' : 'bg-gray-100'} p-6 rounded-md mb-6`}>
                <table className={`min-w-full rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <thead className="bg-gray-800 dark:bg-gray-900 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Tên</th>
                            <th className="py-3 px-4 text-left">Ngày sinh</th>
                            <th className="py-3 px-4 text-left">Giới tính</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Mật khẩu</th>
                            <th className="py-3 px-4 text-left">Tên nhà cung cấp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-4 text-black dark:text-white">1</td>
                            <td className="py-3 px-4 text-black dark:text-white">Người dùng 1</td>
                            <td className="py-3 px-4 text-black dark:text-white">1990-01-01</td>
                            <td className="py-3 px-4 text-black dark:text-white">male</td>
                            <td className="py-3 px-4 text-black dark:text-white">user1@example.com</td>
                            <td className="py-3 px-4 text-black dark:text-white">
                                <input type="password" value="password123" className="bg-transparent border-none focus:outline-none" readOnly />
                            </td>
                            <td className="py-3 px-4 text-black dark:text-white">Google</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-4 text-black dark:text-white">2</td>
                            <td className="py-3 px-4 text-black dark:text-white">Người dùng 2</td>
                            <td className="py-3 px-4 text-black dark:text-white">1992-02-02</td>
                            <td className="py-3 px-4 text-black dark:text-white">female</td>
                            <td className="py-3 px-4 text-black dark:text-white">user2@example.com</td>
                            <td className="py-3 px-4 text-black dark:text-white">
                                <input type="password" value="password123" className="bg-transparent border-none focus:outline-none" readOnly />
                            </td>
                            <td className="py-3 px-4 text-black dark:text-white">Facebook</td>
                        </tr>
                        {/* Thêm người dùng khác ở đây */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListUser;
