import React from 'react';

type Props = {}

const ListBanners = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10">
            <h3 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Danh sách Banners</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-md mb-6">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-800 dark:bg-gray-900 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Tiêu đề</th>
                            <th className="py-3 px-4 text-left">Đường dẫn hình ảnh</th>
                            <th className="py-3 px-4 text-left">Liên kết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-4 text-black dark:text-white">1</td>
                            <td className="py-3 px-4 text-black dark:text-white">Banner 1</td>
                            <td className="py-3 px-4 text-black dark:text-white">/images/banner1.jpg</td>
                            <td className="py-3 px-4 text-black dark:text-white">https://example.com/link1</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-4 text-black dark:text-white">2</td>
                            <td className="py-3 px-4 text-black dark:text-white">Banner 2</td>
                            <td className="py-3 px-4 text-black dark:text-white">/images/banner2.jpg</td>
                            <td className="py-3 px-4 text-black dark:text-white">https://example.com/link2</td>
                        </tr>
                        {/* Thêm các banner khác ở đây */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default ListBanners;
