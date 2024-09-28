import React from 'react'

type Props = {}

const ListProducts = (props: Props) => {
    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Danh sách sản phẩm</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Slug</th>
                        <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                        <th className="py-3 px-4 text-left">Giá</th>
                        <th className="py-3 px-4 text-left">Kho</th>
                        <th className="py-3 px-4 text-left">Mô tả</th>
                        <th className="py-3 px-4 text-left">Nội dung</th>
                        <th className="py-3 px-4 text-left">Lượt xem</th>
                        <th className="py-3 px-4 text-left">Loại</th>
                        <th className="py-3 px-4 text-left">Hot</th>
                        <th className="py-3 px-4 text-left">Hot Deal</th>
                        <th className="py-3 px-4 text-left">Mới</th>
                        <th className="py-3 px-4 text-left">Hiển thị trang chủ</th>
                    </tr>
                </thead>
                <tbody>

                    <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">ao-thun</td>
                        <td className="py-3 px-4">Áo thun</td>
                        <td className="py-3 px-4">500.00 VND</td>
                        <td className="py-3 px-4">HN</td>
                        <td className="py-3 px-4">desc</td>
                        <td className="py-3 px-4">abc</td>
                        <td className="py-3 px-4">20</td>
                        <td className="py-3 px-4">abv</td>
                        <td className="py-3 px-4">fgfgb</td>
                        <td className="py-3 px-4">bfbgfbf</td>
                        <td className="py-3 px-4">bfgbfg</td>
                    </tr>

                </tbody>
            </table>
        </div>

    )
}

export default ListProducts