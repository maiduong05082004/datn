import React from 'react'

type Props = {}


const ListBanners = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h3 className="text-2xl font-bold mb-6 text-center">Danh sách Banners</h3>
            <div className="bg-gray-100 p-6 rounded-md mb-6">
                <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Tiêu đề</th>
                            <th className="py-3 px-4 text-left">Đường dẫn hình ảnh</th>
                            <th className="py-3 px-4 text-left">Liên kết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <td className="py-3 px-4">1</td>
                            <td className="py-3 px-4">Banner 1</td>
                            <td className="py-3 px-4">/images/banner1.jpg</td>
                            <td className="py-3 px-4">https://example.com/link1</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="py-3 px-4">2</td>
                            <td className="py-3 px-4">Banner 2</td>
                            <td className="py-3 px-4">/images/banner2.jpg</td>
                            <td className="py-3 px-4">https://example.com/link2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListBanners