import React, { useState } from 'react';
import { format } from 'date-fns'; // Import thư viện date-fns để định dạng ngày

type Props = {}

const BlockUser = (props: Props) => {

    const [darkMode, setDarkMode] = useState(false); // Chế độ tối mặc định là false (chế độ sáng)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Hàm định dạng ngày sinh thành dd-vv-yyyyy
    const formatBirthDate = (date: string) => {
        const parsedDate = new Date(date);
        return format(parsedDate, 'dd-MM-yyyy'); // Định dạng thành dd-MM-yyyy
    }

    return (
        <div className={`w-full mx-auto p-6 rounded-lg shadow-lg mt-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-black'}`}>
                Danh sách tài khoản bị chặn
            </h3>
            <div className={`bg-gray-100 ${darkMode ? 'dark:bg-gray-700' : 'bg-gray-100'} p-6 rounded-md mb-6`}>
                <table className={`min-w-full rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <thead className="bg-gray-800 dark:bg-gray-900 text-white">
                        <tr>
                            <th className="py-3 px-4 text-center">ID</th>
                            <th className="py-3 px-4 text-center">Tên</th>
                            <th className="py-3 px-4 text-center">Ngày sinh</th>
                            <th className="py-3 px-4 text-center">Giới tính</th>
                            <th className="py-3 px-4 text-center">Email</th>
                            <th className="py-3 px-4 text-center">Địa chỉ</th>
                            <th className="py-3 px-4 text-center">Tên nhà cung cấp</th>
                            <th className="py-3 px-4 text-center">Thao tác</th> {/* Thêm cột thao tác */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-4 text-center text-black dark:text-white">1</td>
                            <td className="py-3 px-4 text-center text-black dark:text-white">Người dùng 1</td>
                            <td className="py-3 px-4 text-center text-black dark:text-white">
                                {formatBirthDate('1990-01-01')}
                            </td>
                            <td className="py-3 px-4 text-center text-black dark:text-white">male</td>
                            <td className="py-3 px-4 text-center text-black dark:text-white">user1@example.com</td>
                            <td className="py-3 px-4 text-center text-black dark:text-white">Hà Nội</td>
                            <td className="py-3 px-4 text-center text-black dark:text-white">Google</td>
                            <td className="py-3 px-4 text-center text-black dark:text-white">
                                <button className="bg-blue-500 text-white py-1 px-3 rounded-lg mr-2">Sửa</button>
                                <button className="bg-red-500 text-white py-1 px-3 rounded-lg">Bỏ chặn</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default BlockUser;
